import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { vi } from 'vitest';

import { AuthTokens } from '../../../core/auth/auth-tokens.model';
import { TOKEN_STORAGE, TokenStorage } from '../../../core/auth/token-storage';
import { AuthenticationResponse } from './auth-api.models';
import { AuthApiService } from './auth-api.service';
import { AuthStore } from './auth.store';
import { AUTH_ROLE } from '../../../core/auth/auth-role.model';
import { AccountApiService } from './account-api.service';

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
        login: vi.fn(),
        refreshSession: vi.fn(),
        logout: vi.fn(),
        access: vi.fn()
    };
    const accountApiMock = {
        changePassword: vi.fn()
    };

    beforeEach(() => {
        storage = new MemoryTokenStorage();
        authApiMock.login.mockReset();
        authApiMock.refreshSession.mockReset();
        authApiMock.logout.mockReset();
        authApiMock.access.mockReset();
        authApiMock.access.mockReturnValue(of({ idUser: 7, roles: [], permissions: [] }));
        accountApiMock.changePassword.mockReset();

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
                },
                { provide: AccountApiService, useValue: accountApiMock }
            ]
        });
    });

    it('should initialize as anonymous when there is no stored session', async () => {
        const store = TestBed.inject(AuthStore);

        await store.initialize();

        expect(store.isAuthenticated()).toBe(false);
        expect(store.currentUser()).toBeNull();
    });

    it('should authenticate and store the returned tokens', async () => {
        const accessToken = createAccessToken('ADMIN', 'ADMIN', 'session-1');

        authApiMock.login.mockReturnValue(of(createAuthenticationResponse(accessToken, 'refresh-token', 'session-1')));

        const store = TestBed.inject(AuthStore);

        await store.login({
            username: 'ADMIN',
            password: 'Password123!',
            deviceId: null,
            deviceLabel: 'PCR Front V2'
        });

        expect(store.isAuthenticated()).toBe(true);
        expect(store.currentUser()?.username).toBe('ADMIN');
        expect(store.roleCode()).toBe(AUTH_ROLE.ADMIN);
        expect(store.isAdmin()).toBe(true);
        expect(store.isUser()).toBe(false);
        expect(store.hasRole(AUTH_ROLE.ADMIN)).toBe(true);
        expect(store.hasRole(AUTH_ROLE.USER)).toBe(false);
        expect(storage.accessToken).toBe(accessToken);
        expect(storage.refreshToken).toBe('refresh-token');
    });

    it('should restore a valid stored session without refreshing it', async () => {
        storage.setTokens({
            accessToken: createAccessToken('ASISTENTE', 'USER', 'session-2'),
            refreshToken: 'refresh-token'
        });

        const store = TestBed.inject(AuthStore);

        await store.initialize();

        expect(store.isAuthenticated()).toBe(true);
        expect(store.currentUser()?.username).toBe('ASISTENTE');
        expect(store.roleCode()).toBe(AUTH_ROLE.USER);
        expect(store.isAdmin()).toBe(false);
        expect(store.isUser()).toBe(true);
        expect(store.hasRole(AUTH_ROLE.ADMIN)).toBe(false);
        expect(store.hasRole(AUTH_ROLE.USER)).toBe(true);
        expect(authApiMock.refreshSession).not.toHaveBeenCalled();
    });

    it('should refresh an expired stored access token during initialization', async () => {
        storage.setTokens({
            accessToken: createAccessToken('ADMIN', 'ADMIN', 'session-3', 100),
            refreshToken: 'old-refresh-token'
        });

        const newAccessToken = createAccessToken('ADMIN', 'ADMIN', 'session-3');

        authApiMock.refreshSession.mockReturnValue(of(
            createAuthenticationResponse(newAccessToken, 'new-refresh-token', 'session-3')
        ));

        const store = TestBed.inject(AuthStore);

        await store.initialize();

        expect(authApiMock.refreshSession).toHaveBeenCalledWith({
            refreshToken: 'old-refresh-token'
        });

        expect(store.isAuthenticated()).toBe(true);
        expect(storage.accessToken).toBe(newAccessToken);
        expect(storage.refreshToken).toBe('new-refresh-token');
    });

    it('should share one refresh request between concurrent refresh attempts', async () => {
        storage.setTokens({
            accessToken: createAccessToken('ADMIN', 'ADMIN', 'session-4', 100),
            refreshToken: 'old-refresh-token'
        });

        const newAccessToken = createAccessToken('ADMIN', 'ADMIN', 'session-4');
        const refreshResponse = new Subject<AuthenticationResponse>();

        authApiMock.refreshSession.mockReturnValue(refreshResponse.asObservable());

        const store = TestBed.inject(AuthStore);
        const firstRefresh = store.refreshAccessToken();
        const secondRefresh = store.refreshAccessToken();

        expect(authApiMock.refreshSession).toHaveBeenCalledTimes(1);

        refreshResponse.next(createAuthenticationResponse(newAccessToken, 'new-refresh-token', 'session-4'));
        refreshResponse.complete();

        const [firstToken, secondToken] = await Promise.all([firstRefresh, secondRefresh]);

        expect(firstToken).toBe(newAccessToken);
        expect(secondToken).toBe(newAccessToken);
        expect(authApiMock.refreshSession).toHaveBeenCalledTimes(1);
    });

    it('should clear the session when initialization cannot refresh it', async () => {
        storage.setTokens({
            accessToken: createAccessToken('ADMIN', 'ADMIN', 'session-5', 100),
            refreshToken: 'invalid-refresh-token'
        });

        authApiMock.refreshSession.mockReturnValue(throwError(() => new Error('Refresh rejected')));

        const store = TestBed.inject(AuthStore);

        await store.initialize();

        expect(store.isAuthenticated()).toBe(false);
        expect(storage.accessToken).toBeNull();
        expect(storage.refreshToken).toBeNull();
    });

    it('should logout and clear the local session', async () => {
        storage.setTokens({
            accessToken: createAccessToken('ADMIN', 'ADMIN', 'session-6'),
            refreshToken: 'refresh-token'
        });

        authApiMock.logout.mockReturnValue(of({
            exito: true,
            codigo: 'OK',
            mensaje: 'Sesión cerrada correctamente.'
        }));

        const store = TestBed.inject(AuthStore);
        await store.initialize();

        expect(store.isAuthenticated()).toBe(true);

        await store.logout();

        expect(authApiMock.logout).toHaveBeenCalledTimes(1);
        expect(store.isAuthenticated()).toBe(false);
        expect(store.currentUser()).toBeNull();
        expect(storage.accessToken).toBeNull();
        expect(storage.refreshToken).toBeNull();
    });

    it('should clear the local session even when logout request fails', async () => {
        storage.setTokens({
            accessToken: createAccessToken('ADMIN', 'ADMIN', 'session-7'),
            refreshToken: 'refresh-token'
        });

        authApiMock.logout.mockReturnValue(
            throwError(() => new Error('Logout failed'))
        );

        const store = TestBed.inject(AuthStore);
        await store.initialize();

        expect(store.isAuthenticated()).toBe(true);

        await expect(store.logout()).rejects.toThrow('Logout failed');

        expect(store.isAuthenticated()).toBe(false);
        expect(store.currentUser()).toBeNull();
        expect(storage.accessToken).toBeNull();
        expect(storage.refreshToken).toBeNull();
    });

    it('should clear the session when password change requires a new login', async () => {
        storage.setTokens({
            accessToken: createAccessToken('ADMIN', 'ADMIN', 'session-8'),
            refreshToken: 'refresh-token'
        });

        accountApiMock.changePassword.mockReturnValue(of({
            mensaje: 'Contraseña actualizada correctamente.',
            requiresNewLogin: true
        }));

        const store = TestBed.inject(AuthStore);
        await store.initialize();

        const request = {
            currentPassword: 'Temporal123!',
            newPassword: 'NuevaPassword123!',
            confirmPassword: 'NuevaPassword123!'
        };

        const response = await store.changePassword(request);

        expect(accountApiMock.changePassword).toHaveBeenCalledWith(request);
        expect(response.requiresNewLogin).toBe(true);
        expect(store.isAuthenticated()).toBe(false);
        expect(store.currentUser()).toBeNull();
        expect(storage.accessToken).toBeNull();
        expect(storage.refreshToken).toBeNull();
    });

    it('should keep the session when password change fails', async () => {
        const accessToken = createAccessToken('ADMIN', 'ADMIN', 'session-9');

        storage.setTokens({
            accessToken,
            refreshToken: 'refresh-token'
        });

        accountApiMock.changePassword.mockReturnValue(
            throwError(() => new Error('La contraseña actual no es correcta.'))
        );

        const store = TestBed.inject(AuthStore);
        await store.initialize();

        await expect(store.changePassword({
            currentPassword: 'Incorrecta123!',
            newPassword: 'NuevaPassword123!',
            confirmPassword: 'NuevaPassword123!'
        })).rejects.toThrow('La contraseña actual no es correcta.');

        expect(store.isAuthenticated()).toBe(true);
        expect(storage.accessToken).toBe(accessToken);
        expect(storage.refreshToken).toBe('refresh-token');
    });


    it('should expose permissions returned by current access', async () => {
        const accessToken = createAccessToken('SECRETARIA', 'USER', 'session-rbac');
        storage.setTokens({ accessToken, refreshToken: 'refresh-token' });
        authApiMock.access.mockReturnValue(of({ idUser: 7, roles: [{ idRole: 3, code: 'SECRETARIA', name: 'Secretaría', description: null, isActive: true, isSystem: true, grantsAllPermissions: false }], permissions: [{ idPermiso: 1, codigo: 'USUARIO_VER', modulo: 'SEGURIDAD_USUARIOS', accion: 'VER', nombre: 'Ver usuarios' }] }));
        const store = TestBed.inject(AuthStore); await store.initialize();
        expect(store.roleCodes()).toEqual(['SECRETARIA']); expect(store.permissions()).toEqual(['USUARIO_VER']); expect(store.hasPermission('USUARIO_VER')).toBe(true); expect(store.hasPermission('ROL_VER')).toBe(false);
    });

    it('should expose null for an unsupported role', async () => {
        storage.setTokens({
            accessToken: createAccessToken('TEST', 'UNKNOWN', 'session-10'),
            refreshToken: 'refresh-token'
        });

        const store = TestBed.inject(AuthStore);
        await store.initialize();

        expect(store.roleCode()).toBeNull();
        expect(store.isAdmin()).toBe(false);
        expect(store.isUser()).toBe(false);
    });
});

function createAuthenticationResponse(accessToken: string, refreshToken: string, sessionId: string): AuthenticationResponse {
    return {
        succeeded: true,
        error: null,
        accessToken,
        refreshToken,
        sessionId,
        mustChangePassword: false
    };
}

function createAccessToken(username: string, role: string, sessionId: string, exp = 4102444800): string {
    return createToken({
        nameid: '7',
        unique_name: username,
        Nombre: username,
        role,
        sid: sessionId,
        must_change_password: 'false',
        exp
    });
}

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