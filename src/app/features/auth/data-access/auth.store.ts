import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthenticatedUser } from '../../../core/auth/authenticated-user.model';
import { isAccessTokenExpired, parseAuthenticatedUser } from '../../../core/auth/jwt-user.parser';
import { TOKEN_STORAGE } from '../../../core/auth/token-storage';
import { AuthenticationResponse, LoginRequest } from './auth-api.models';
import { AuthApiService } from './auth-api.service';
import { AUTH_ROLE, AuthRole } from '../../../core/auth/auth-role.model';
import { AccountApiService } from './account-api.service';
import { ChangePasswordRequest, ChangePasswordResponse } from './account-api.models';

export type AuthStatus = 'anonymous' | 'authenticating' | 'authenticated';

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    private readonly authApi = inject(AuthApiService);
    private readonly accountApi = inject(AccountApiService);
    private readonly tokenStorage = inject(TOKEN_STORAGE);
    private readonly statusSignal = signal<AuthStatus>('anonymous');
    private readonly userSignal = signal<AuthenticatedUser | null>(null);
    private refreshPromise: Promise<string> | null = null;

    readonly status = this.statusSignal.asReadonly();
    readonly currentUser = this.userSignal.asReadonly();
    readonly isAuthenticated = computed(() => this.statusSignal() === 'authenticated' && this.userSignal() !== null);
    readonly isAuthenticating = computed(() => this.statusSignal() === 'authenticating');
    readonly roleCode = computed<AuthRole | null>(() => {
        const role = this.userSignal()?.roleCode;
        return role === AUTH_ROLE.ADMIN || role === AUTH_ROLE.USER ? role : null;
    });
    readonly isAdmin = computed(() => this.roleCode() === AUTH_ROLE.ADMIN);
    readonly isUser = computed(() => this.roleCode() === AUTH_ROLE.USER);
    readonly mustChangePassword = computed(() => this.userSignal()?.mustChangePassword ?? false);

    hasRole(role: AuthRole): boolean {
        return this.roleCode() === role;
    }

    async initialize(): Promise<void> {
        const accessToken = this.tokenStorage.getAccessToken();
        const refreshToken = this.tokenStorage.getRefreshToken();

        if (!refreshToken) {
            this.clearSession();
            return;
        }

        const user = accessToken ? parseAuthenticatedUser(accessToken) : null;

        if (user && !isAccessTokenExpired(user)) {
            this.userSignal.set(user);
            this.statusSignal.set('authenticated');
            return;
        }

        try {
            await this.refreshAccessToken();
        } catch {
            this.clearSession();
        }
    }

    async login(request: LoginRequest): Promise<void> {
        this.statusSignal.set('authenticating');

        try {
            const response = await firstValueFrom(this.authApi.login(request));
            this.applyAuthentication(response);
        } catch (error) {
            this.clearSession();
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await firstValueFrom(this.authApi.logout());
        } finally {
            this.clearSession();
        }
    }

    async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        const response = await firstValueFrom(this.accountApi.changePassword(request));

        if (response.requiresNewLogin) {
            this.clearSession();
        }

        return response;
    }

    async refreshAccessToken(): Promise<string> {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = this.performRefresh();

        try {
            return await this.refreshPromise;
        } finally {
            this.refreshPromise = null;
        }
    }

    clearSession(): void {
        this.tokenStorage.clear();
        this.userSignal.set(null);
        this.statusSignal.set('anonymous');
    }

    private async performRefresh(): Promise<string> {
        const refreshToken = this.tokenStorage.getRefreshToken();

        if (!refreshToken) {
            this.clearSession();
            throw new Error('No hay un refresh token disponible.');
        }

        try {
            const response = await firstValueFrom(this.authApi.refreshSession({ refreshToken }));
            this.applyAuthentication(response);

            return response.accessToken;
        } catch (error) {
            this.clearSession();
            throw error;
        }
    }

    private applyAuthentication(response: AuthenticationResponse): void {
        if (!response.succeeded || !response.accessToken || !response.refreshToken) {
            throw new Error(response.error?.trim() || 'La autenticación no devolvió una sesión válida.');
        }

        const user = parseAuthenticatedUser(response.accessToken);

        if (!user || isAccessTokenExpired(user)) {
            throw new Error('El token de acceso recibido no es válido.');
        }

        if (user.sessionId.toLowerCase() !== response.sessionId.toLowerCase()) {
            throw new Error('La sesión recibida no coincide con el token de acceso.');
        }

        if (user.mustChangePassword !== response.mustChangePassword) {
            throw new Error('El estado de cambio de contraseña no coincide con el token de acceso.');
        }

        this.tokenStorage.setTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
        });

        this.userSignal.set(user);
        this.statusSignal.set('authenticated');
    }
}