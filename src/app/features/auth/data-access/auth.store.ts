import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthenticatedUser } from '../../../core/auth/authenticated-user.model';
import { isAccessTokenExpired, parseAuthenticatedUser } from '../../../core/auth/jwt-user.parser';
import { TOKEN_STORAGE } from '../../../core/auth/token-storage';
import { AuthenticationResponse, LoginRequest } from './auth-api.models';
import { AuthApiService } from './auth-api.service';

export type AuthStatus = 'anonymous' | 'authenticating' | 'authenticated';

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    private readonly authApi = inject(AuthApiService);
    private readonly tokenStorage = inject(TOKEN_STORAGE);
    private readonly statusSignal = signal<AuthStatus>('anonymous');
    private readonly userSignal = signal<AuthenticatedUser | null>(null);

    readonly status = this.statusSignal.asReadonly();
    readonly currentUser = this.userSignal.asReadonly();

    readonly isAuthenticated = computed(() => this.statusSignal() === 'authenticated' && this.userSignal() !== null);
    readonly isAuthenticating = computed(() => this.statusSignal() === 'authenticating');
    readonly roleCode = computed(() => this.userSignal()?.roleCode ?? null);
    readonly isAdmin = computed(() => this.roleCode() === 'ADMIN');
    readonly mustChangePassword = computed(() => this.userSignal()?.mustChangePassword ?? false);

    constructor() {
        this.restoreSession();
    }

    async login(request: LoginRequest): Promise<void> {
        this.statusSignal.set('authenticating');

        try {
            const response = await firstValueFrom(this.authApi.login(request));
            this.applyAuthentication(response);
        } catch (error) {
            this.tokenStorage.clear();
            this.userSignal.set(null);
            this.statusSignal.set('anonymous');

            throw error;
        }
    }

    clearSession(): void {
        this.tokenStorage.clear();
        this.userSignal.set(null);
        this.statusSignal.set('anonymous');
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

    private restoreSession(): void {
        const accessToken = this.tokenStorage.getAccessToken();
        const refreshToken = this.tokenStorage.getRefreshToken();

        if (!accessToken || !refreshToken) {
            this.tokenStorage.clear();
            return;
        }

        const user = parseAuthenticatedUser(accessToken);

        if (!user || isAccessTokenExpired(user)) {
            this.tokenStorage.clear();
            return;
        }

        this.userSignal.set(user);
        this.statusSignal.set('authenticated');
    }
}