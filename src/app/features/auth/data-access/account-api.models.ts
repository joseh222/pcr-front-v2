export interface ChangePasswordRequest {
    readonly currentPassword: string;
    readonly newPassword: string;
    readonly confirmPassword: string;
}

export interface ChangePasswordResponse {
    readonly mensaje: string;
    readonly requiresNewLogin: boolean;
}