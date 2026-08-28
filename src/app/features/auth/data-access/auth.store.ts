import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AUTH_ROLE, AuthRole } from '../../../core/auth/auth-role.model';
import { AuthenticatedUser } from '../../../core/auth/authenticated-user.model';
import { isAccessTokenExpired, parseAuthenticatedUser } from '../../../core/auth/jwt-user.parser';
import { TOKEN_STORAGE } from '../../../core/auth/token-storage';
import { ChangePasswordRequest, ChangePasswordResponse } from './account-api.models';
import { AccountApiService } from './account-api.service';
import { AuthenticationResponse, CurrentAccessResponse, LoginRequest } from './auth-api.models';
import { AuthApiService } from './auth-api.service';

export type AuthStatus = 'anonymous' | 'authenticating' | 'authenticated';

@Injectable({ providedIn: 'root' })
export class AuthStore {
    private readonly authApi = inject(AuthApiService); private readonly accountApi = inject(AccountApiService); private readonly tokenStorage = inject(TOKEN_STORAGE);
    private readonly statusSignal = signal<AuthStatus>('anonymous'); private readonly userSignal = signal<AuthenticatedUser | null>(null); private readonly roleCodesSignal = signal<readonly string[]>([]); private readonly permissionsSignal = signal<readonly string[]>([]); private readonly grantsAllPermissionsSignal = signal(false); private refreshPromise: Promise<string> | null = null;
    readonly status = this.statusSignal.asReadonly(); readonly currentUser = this.userSignal.asReadonly(); readonly roleCodes = this.roleCodesSignal.asReadonly(); readonly permissions = this.permissionsSignal.asReadonly(); readonly grantsAllPermissions = this.grantsAllPermissionsSignal.asReadonly();
    readonly isAuthenticated = computed(() => this.statusSignal() === 'authenticated' && this.userSignal() !== null); readonly isAuthenticating = computed(() => this.statusSignal() === 'authenticating');
    readonly roleCode = computed<AuthRole | null>(() => { const role = this.userSignal()?.roleCode; return role === AUTH_ROLE.ADMIN || role === AUTH_ROLE.USER ? role : null; }); readonly isAdmin = computed(() => this.roleCode() === AUTH_ROLE.ADMIN); readonly isUser = computed(() => this.roleCode() === AUTH_ROLE.USER); readonly mustChangePassword = computed(() => this.userSignal()?.mustChangePassword ?? false);

    hasRole(role: AuthRole): boolean { return this.roleCode() === role; }
    hasPermission(permission: string): boolean { const code = permission.trim().toUpperCase(); return !!code && (this.grantsAllPermissionsSignal() || this.permissionsSignal().includes(code)); }
    hasAllPermissions(permissions: readonly string[]): boolean { return permissions.every(permission => this.hasPermission(permission)); }
    hasAnyPermission(permissions: readonly string[]): boolean { return permissions.some(permission => this.hasPermission(permission)); }

    async initialize(): Promise<void> {
        const accessToken = this.tokenStorage.getAccessToken(); const refreshToken = this.tokenStorage.getRefreshToken();
        if (!refreshToken) { this.clearSession(); return; }
        const user = accessToken ? parseAuthenticatedUser(accessToken) : null;
        if (user && !isAccessTokenExpired(user)) { this.applyUser(user); if (!user.mustChangePassword) await this.synchronizeAccessSafely(); return; }
        try { await this.refreshAccessToken(); if (!this.mustChangePassword()) await this.synchronizeAccessSafely(); } catch { this.clearSession(); }
    }

    async login(request: LoginRequest): Promise<void> {
        this.statusSignal.set('authenticating');
        try { const response = await firstValueFrom(this.authApi.login(request)); this.applyAuthentication(response); if (!this.mustChangePassword()) await this.synchronizeAccessSafely(); } catch (error) { this.clearSession(); throw error; }
    }

    async refreshCurrentAccess(): Promise<void> {
        if (!this.isAuthenticated() || this.mustChangePassword()) return;
        const access = await firstValueFrom(this.authApi.access()); this.applyCurrentAccess(access);
    }

    async logout(): Promise<void> { try { await firstValueFrom(this.authApi.logout()); } finally { this.clearSession(); } }
    async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> { const response = await firstValueFrom(this.accountApi.changePassword(request)); if (response.requiresNewLogin) this.clearSession(); return response; }
    async refreshAccessToken(): Promise<string> { if (this.refreshPromise) return this.refreshPromise; this.refreshPromise = this.performRefresh(); try { return await this.refreshPromise; } finally { this.refreshPromise = null; } }
    clearSession(): void { this.tokenStorage.clear(); this.userSignal.set(null); this.roleCodesSignal.set([]); this.permissionsSignal.set([]); this.grantsAllPermissionsSignal.set(false); this.statusSignal.set('anonymous'); }

    private async performRefresh(): Promise<string> {
        const refreshToken = this.tokenStorage.getRefreshToken(); if (!refreshToken) { this.clearSession(); throw new Error('No hay un refresh token disponible.'); }
        try { const response = await firstValueFrom(this.authApi.refreshSession({ refreshToken })); this.applyAuthentication(response); return response.accessToken; } catch (error) { this.clearSession(); throw error; }
    }
    private applyAuthentication(response: AuthenticationResponse): void {
        if (!response.succeeded || !response.accessToken || !response.refreshToken) throw new Error(response.error?.trim() || 'La autenticación no devolvió una sesión válida.');
        const user = parseAuthenticatedUser(response.accessToken); if (!user || isAccessTokenExpired(user)) throw new Error('El token de acceso recibido no es válido.');
        if (user.sessionId.toLowerCase() !== response.sessionId.toLowerCase()) throw new Error('La sesión recibida no coincide con el token de acceso.');
        if (user.mustChangePassword !== response.mustChangePassword) throw new Error('El estado de cambio de contraseña no coincide con el token de acceso.');
        this.tokenStorage.setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken }); this.applyUser(user);
    }
    private applyUser(user: AuthenticatedUser): void { this.userSignal.set(user); this.roleCodesSignal.set(this.normalizeCodes(user.roleCodes?.length ? user.roleCodes : [user.roleCode])); this.permissionsSignal.set(this.normalizeCodes(user.permissions ?? [])); this.grantsAllPermissionsSignal.set(false); this.statusSignal.set('authenticated'); }
    private applyCurrentAccess(access: CurrentAccessResponse): void {
        const currentUser = this.userSignal(); if (!currentUser || access.idUser !== currentUser.idUser) throw new Error('La información de acceso no corresponde al usuario autenticado.');
        this.roleCodesSignal.set(this.normalizeCodes(access.roles.filter(role => role.isActive).map(role => role.code))); this.permissionsSignal.set(this.normalizeCodes(access.permissions.map(permission => permission.codigo))); this.grantsAllPermissionsSignal.set(access.roles.some(role => role.isActive && role.grantsAllPermissions));
    }
    private async synchronizeAccessSafely(): Promise<void> { try { await this.refreshCurrentAccess(); } catch { /* El JWT mantiene un snapshot válido; el backend sigue siendo la autoridad. */ } }
    private normalizeCodes(values: readonly string[]): readonly string[] { return [...new Set(values.map(value => value.trim().toUpperCase()).filter(Boolean))]; }
}
