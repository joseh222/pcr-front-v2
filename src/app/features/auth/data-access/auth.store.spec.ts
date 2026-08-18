import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AuthTokens } from '../../../core/auth/auth-tokens.model';
import { TOKEN_STORAGE, TokenStorage } from '../../../core/auth/token-storage';
import { AuthApiService } from './auth-api.service';
import { AuthStore } from './auth.store';

class MemoryTokenStorage implements TokenStorage {
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

describe('AuthStore', () => {
    let storage: MemoryTokenStorage;

    const authApiMock = {
        login: vi.fn()
    };

    beforeEach(() => {
        storage = new MemoryTokenStorage();
        authApiMock.login.mockReset();

        TestBed.configureTestingModule({
            providers: [
                AuthStore,
                {
                    provide: AuthApiService,
                    useValue: authApiMock
                },
                {
                    provide: TOKEN_STORAGE,
                    useValue: storage
                }
            ]
        });
    });

    it('should start as anonymous when there is no stored session', () => {
        const store = TestBed.inject(AuthStore);

        expect(store.status()).toBe('anonymous');
        expect(store.isAuthenticated()).toBe(false);
        expect(store.currentUser()).toBeNull();
    });

    it('should authenticate and store the returned tokens', async () => {
        const accessToken = createToken({
            nameid: '7',
            unique_name: 'ADMIN',
            Nombre: 'Administrador PCR',
            role: 'ADMIN',
            sid: '5e986957-6d4b-4717-9cb6-985eb433723d',
            must_change_password: 'false',
            exp: 4102444800
        });

        authApiMock.login.mockReturnValue(of({
            succeeded: true,
            error: null,
            accessToken,
            refreshToken: 'refresh-token',
            sessionId: '5e986957-6d4b-4717-9cb6-985eb433723d',
            mustChangePassword: false
        }));

        const store = TestBed.inject(AuthStore);

        await store.login({
            username: 'ADMIN',
            password: 'Password123!',
            deviceId: null,
            deviceLabel: 'PCR Front V2'
        });

        expect(store.isAuthenticated()).toBe(true);
        expect(store.currentUser()?.username).toBe('ADMIN');
        expect(store.roleCode()).toBe('ADMIN');
        expect(store.isAdmin()).toBe(true);
        expect(storage.accessToken).toBe(accessToken);
        expect(storage.refreshToken).toBe('refresh-token');
    });

    it('should restore a valid stored session', () => {
        storage.setTokens({
            accessToken: createToken({
                nameid: '8',
                unique_name: 'ASISTENTE',
                Nombre: 'Usuario Asistente',
                role: 'USER',
                sid: '42878490-a088-4b53-b807-e61aa356dd04',
                must_change_password: 'false',
                exp: 4102444800
            }),
            refreshToken: 'refresh-token'
        });

        const store = TestBed.inject(AuthStore);

        expect(store.isAuthenticated()).toBe(true);
        expect(store.currentUser()?.username).toBe('ASISTENTE');
        expect(store.roleCode()).toBe('USER');
        expect(store.isAdmin()).toBe(false);
    });
});

function createToken(payload: Record<string, unknown>): string {
    return `${encodeBase64Url({ alg: 'HS256', typ: 'JWT' })}.${encodeBase64Url(payload)}.signature`;
}

function encodeBase64Url(value: unknown): string {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}