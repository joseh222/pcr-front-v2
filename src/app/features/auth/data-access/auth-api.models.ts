export interface LoginRequest { readonly username: string; readonly password: string; readonly deviceId?: string | null; readonly deviceLabel?: string | null; }
export interface RefreshSessionRequest { readonly refreshToken: string; }
export interface AuthenticationResponse { readonly succeeded: boolean; readonly error: string | null; readonly accessToken: string; readonly refreshToken: string; readonly sessionId: string; readonly mustChangePassword: boolean; }
export interface LogoutResponse { readonly exito: boolean; readonly codigo: string; readonly mensaje: string; }
export interface CurrentAccessRole { readonly idRole: number; readonly code: string; readonly name: string; readonly description: string | null; readonly isActive: boolean; readonly isSystem: boolean; readonly grantsAllPermissions: boolean; }
export interface CurrentAccessPermission { readonly idPermiso: number; readonly codigo: string; readonly modulo: string; readonly accion: string; readonly nombre: string; }
export interface CurrentAccessResponse { readonly idUser: number; readonly roles: readonly CurrentAccessRole[]; readonly permissions: readonly CurrentAccessPermission[]; }
export interface ApiErrorResponse { readonly success: false; readonly code: number; readonly messages?: readonly string[]; readonly message?: readonly string[]; readonly traceId?: string | null; readonly error?: unknown; }
