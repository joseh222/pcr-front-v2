export interface AuthenticatedUser {
    readonly idUser: number;
    readonly username: string;
    readonly displayName: string;
    readonly email: string | null;
    readonly roleCode: string;
    readonly roleCodes?: readonly string[];
    readonly permissions?: readonly string[];
    readonly sessionId: string;
    readonly mustChangePassword: boolean;
    readonly expiresAtUnix: number;
}
