export interface LoginRequest {
    readonly username: string;
    readonly password: string;
    readonly deviceId?: string | null;
    readonly deviceLabel?: string | null;
}

export interface RefreshSessionRequest {
    readonly refreshToken: string;
}

export interface AuthenticationResponse {
    readonly succeeded: boolean;
    readonly error: string | null;
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly sessionId: string;
    readonly mustChangePassword: boolean;
}

export interface LogoutResponse {
    readonly exito: boolean;
    readonly codigo: string;
    readonly mensaje: string;
}

export interface ApiErrorResponse {
    readonly success: false;
    readonly code: number;
    readonly messages?: readonly string[];
    readonly message?: readonly string[];
    readonly traceId?: string | null;
    readonly error?: unknown;
}