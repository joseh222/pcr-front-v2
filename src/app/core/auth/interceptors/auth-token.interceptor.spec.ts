import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RuntimeConfigService } from '../../config/runtime-config.service';
import { AuthTokens } from '../auth-tokens.model';
import { SKIP_AUTH } from '../auth-http-context';
import { TOKEN_STORAGE, TokenStorage } from '../token-storage';
import { authTokenInterceptor } from './auth-token.interceptor';

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

describe('authTokenInterceptor', () => {
    let http: HttpClient;
    let httpTesting: HttpTestingController;
    let tokenStorage: TestTokenStorage;

    const runtimeConfigMock = {
        config: {
            apiBaseUrl: 'https://localhost:9001/api'
        }
    };

    beforeEach(() => {
        tokenStorage = new TestTokenStorage();

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authTokenInterceptor])),
                provideHttpClientTesting(),
                {
                    provide: RuntimeConfigService,
                    useValue: runtimeConfigMock
                },
                {
                    provide: TOKEN_STORAGE,
                    useValue: tokenStorage
                }
            ]
        });

        http = TestBed.inject(HttpClient);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should add the access token to requests made to the PCR API', () => {
        tokenStorage.accessToken = 'access-token-test';

        http.get('https://localhost:9001/api/Persona').subscribe();

        const request = httpTesting.expectOne('https://localhost:9001/api/Persona');

        expect(request.request.headers.get('Authorization')).toBe('Bearer access-token-test');

        request.flush({});
    });

    it('should not add authorization when SKIP_AUTH is enabled', () => {
        tokenStorage.accessToken = 'access-token-test';
        const context = new HttpContext().set(SKIP_AUTH, true);

        http.post('https://localhost:9001/api/Seguridad/Login', {}, { context }).subscribe();

        const request = httpTesting.expectOne('https://localhost:9001/api/Seguridad/Login');

        expect(request.request.headers.has('Authorization')).toBe(false);

        request.flush({});
    });

    it('should not send the token to an external API', () => {
        tokenStorage.accessToken = 'access-token-test';

        http.get('https://api.example.com/data').subscribe();

        const request = httpTesting.expectOne('https://api.example.com/data');

        expect(request.request.headers.has('Authorization')).toBe(false);

        request.flush({});
    });

    it('should send API requests without authorization when there is no access token', () => {
        http.get('https://localhost:9001/api/Persona').subscribe();

        const request = httpTesting.expectOne('https://localhost:9001/api/Persona');

        expect(request.request.headers.has('Authorization')).toBe(false);

        request.flush({});
    });

    it('should allow runtime configuration to load before the API URL is available', () => {
        tokenStorage.accessToken = 'access-token-test';

        http.get('config/app-config.json').subscribe();

        const request = httpTesting.expectOne('config/app-config.json');

        expect(request.request.headers.has('Authorization')).toBe(false);

        request.flush({
            apiBaseUrl: 'https://localhost:9001/api'
        });
    });
});