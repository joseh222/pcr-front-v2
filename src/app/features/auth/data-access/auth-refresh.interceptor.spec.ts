import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';

import { AuthTokens } from '../../../core/auth/auth-tokens.model';
import { SKIP_AUTH } from '../../../core/auth/auth-http-context';
import { authTokenInterceptor } from '../../../core/auth/interceptors/auth-token.interceptor';
import { TOKEN_STORAGE, TokenStorage } from '../../../core/auth/token-storage';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { AuthStore } from './auth.store';
import { authRefreshInterceptor } from './auth-refresh.interceptor';

class TestTokenStorage implements TokenStorage {
    accessToken: string | null = null;
    refreshToken: string | null = null;

    getAccessToken(): string | null {
        return this.accessToken;
    }

    getRefreshToken(): string | null {
        return this.refreshToken;
    }

    setTokens(tokens: AuthTokens): void {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
    }

    clear(): void {
        this.accessToken = null;
        this.refreshToken = null;
    }
}

describe('authRefreshInterceptor', () => {
    let http: HttpClient;
    let httpTesting: HttpTestingController;
    let tokenStorage: TestTokenStorage;

    const authStoreMock = {
        refreshAccessToken: vi.fn(),
        clearSession: vi.fn()
    };

    const routerMock = {
        navigate: vi.fn()
    };

    const runtimeConfigMock = {
        config: {
            apiBaseUrl: 'https://localhost:9001/api'
        }
    };

    beforeEach(() => {
        tokenStorage = new TestTokenStorage();
        authStoreMock.refreshAccessToken.mockReset();
        authStoreMock.clearSession.mockReset();
        routerMock.navigate.mockReset();
        routerMock.navigate.mockResolvedValue(true);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([
                    authTokenInterceptor,
                    authRefreshInterceptor
                ])),
                provideHttpClientTesting(),
                {
                    provide: RuntimeConfigService,
                    useValue: runtimeConfigMock
                },
                {
                    provide: TOKEN_STORAGE,
                    useValue: tokenStorage
                },
                {
                    provide: AuthStore,
                    useValue: authStoreMock
                },
                {
                    provide: Router,
                    useValue: routerMock
                }
            ]
        });

        http = TestBed.inject(HttpClient);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should refresh the session and retry a request after 401', async () => {
        tokenStorage.accessToken = 'old-access-token';
        tokenStorage.refreshToken = 'refresh-token';

        authStoreMock.refreshAccessToken.mockImplementation(async () => {
            tokenStorage.accessToken = 'new-access-token';
            return 'new-access-token';
        });

        const responsePromise = firstValueFrom(
            http.get<{ ok: boolean }>('https://localhost:9001/api/Persona')
        );

        const firstRequest = httpTesting.expectOne('https://localhost:9001/api/Persona');

        expect(firstRequest.request.headers.get('Authorization')).toBe('Bearer old-access-token');

        firstRequest.flush({}, {
            status: 401,
            statusText: 'Unauthorized'
        });

        await Promise.resolve();
        await Promise.resolve();

        const retryRequest = httpTesting.expectOne('https://localhost:9001/api/Persona');

        expect(retryRequest.request.headers.get('Authorization')).toBe('Bearer new-access-token');

        retryRequest.flush({ ok: true });

        await expect(responsePromise).resolves.toEqual({ ok: true });
        expect(authStoreMock.refreshAccessToken).toHaveBeenCalledTimes(1);
    });

    it('should reuse a token that was already refreshed by another request', async () => {
        tokenStorage.accessToken = 'old-access-token';

        const responsePromise = firstValueFrom(
            http.get<{ ok: boolean }>('https://localhost:9001/api/Persona')
        );

        const firstRequest = httpTesting.expectOne('https://localhost:9001/api/Persona');

        tokenStorage.accessToken = 'new-access-token';

        firstRequest.flush({}, {
            status: 401,
            statusText: 'Unauthorized'
        });

        const retryRequest = httpTesting.expectOne('https://localhost:9001/api/Persona');

        expect(retryRequest.request.headers.get('Authorization')).toBe('Bearer new-access-token');

        retryRequest.flush({ ok: true });

        await expect(responsePromise).resolves.toEqual({ ok: true });
        expect(authStoreMock.refreshAccessToken).not.toHaveBeenCalled();
    });

    it('should not refresh requests marked with SKIP_AUTH', async () => {
        tokenStorage.accessToken = 'access-token';
        const context = new HttpContext().set(SKIP_AUTH, true);

        const responsePromise = firstValueFrom(
            http.post('https://localhost:9001/api/Seguridad/RefreshSession', {}, { context })
        );

        const request = httpTesting.expectOne('https://localhost:9001/api/Seguridad/RefreshSession');

        request.flush({}, {
            status: 401,
            statusText: 'Unauthorized'
        });

        await expect(responsePromise).rejects.toBeTruthy();
        expect(authStoreMock.refreshAccessToken).not.toHaveBeenCalled();
    });

    it('should clear the session and navigate to login when refresh fails', async () => {
        tokenStorage.accessToken = 'expired-access-token';
        tokenStorage.refreshToken = 'invalid-refresh-token';

        authStoreMock.refreshAccessToken.mockRejectedValue(new Error('Refresh rejected'));

        const responsePromise = firstValueFrom(
            http.get('https://localhost:9001/api/Persona')
        );

        const request = httpTesting.expectOne('https://localhost:9001/api/Persona');

        request.flush({}, {
            status: 401,
            statusText: 'Unauthorized'
        });

        await expect(responsePromise).rejects.toThrow('Refresh rejected');

        expect(authStoreMock.clearSession).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
            replaceUrl: true
        });
    });
});