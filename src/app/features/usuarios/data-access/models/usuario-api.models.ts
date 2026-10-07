export interface UsuarioRole {
    readonly idRole: number;
    readonly code: string;
    readonly name: string;
    readonly description: string | null;
    readonly isActive: boolean;
    readonly isSystem: boolean;
    readonly grantsAllPermissions: boolean;
}

export interface UsuarioListFilters {
    readonly search?: string | null;
    readonly idRole?: number | null;
    readonly isActive?: boolean | null;
}

export interface UsuarioListQuery extends UsuarioListFilters {
    readonly pageNumber: number;
    readonly pageSize: number;
}

export interface UsuarioListItem {
    readonly idUser: number;
    readonly username: string;
    readonly email: string | null;
    readonly nombreCompleto: string | null;
    readonly idPersona: number | null;
    readonly codPersona: string | null;
    readonly personaNumeroDocumento: string | null;
    readonly personaNombreCompleto: string | null;
    readonly rolesSistema: string | null;
    readonly hasFullAccessRole: boolean;
    readonly isActive: boolean;
    readonly mustChangePassword: boolean;
    readonly isLocked: boolean;
    readonly lockoutEndUtc: string | null;
    readonly lastLoginUtc: string | null;
    readonly createdUtc: string;
    readonly updatedUtc: string | null;
    readonly hasActiveSession: boolean;
}

export interface UsuarioPagedResponse {
    readonly items: readonly UsuarioListItem[];
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly totalRecords: number;
    readonly totalPages: number;
}

export interface UsuarioDetail {
    readonly idUser: number;
    readonly username: string;
    readonly email: string | null;
    readonly nombreCompleto: string | null;
    readonly idPersona: number | null;
    readonly codPersona: string | null;
    readonly personaIdTipoDocumento: number | null;
    readonly personaNumeroDocumento: string | null;
    readonly personaNombreCompleto: string | null;
    readonly personaTelefono: string | null;
    readonly personaEmail: string | null;
    readonly personaIsActive: boolean | null;
    readonly roles: readonly UsuarioRole[];
    readonly isActive: boolean;
    readonly mustChangePassword: boolean;
    readonly isLocked: boolean;
    readonly lockoutEndUtc: string | null;
    readonly failedLoginAttempts: number;
    readonly passwordChangedUtc: string | null;
    readonly lastLoginUtc: string | null;
    readonly createdUtc: string;
    readonly createdById: number | null;
    readonly createdByUsername: string | null;
    readonly updatedUtc: string | null;
    readonly updatedById: number | null;
    readonly updatedByUsername: string | null;
    readonly hasActiveSession: boolean;
    readonly rowVersion: string;
}

export interface UsuarioCreateRequest {
    readonly username: string;
    readonly email: string | null;
    readonly nombreCompleto: string;
    readonly idPersona: number | null;
    readonly roles: readonly number[];
}

export interface UsuarioCreateResponse {
    readonly idUser: number;
    readonly username: string;
    readonly temporaryPassword: string;
    readonly mustChangePassword: boolean;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface UsuarioUpdateRequest {
    readonly email: string | null;
    readonly nombreCompleto: string;
    readonly idPersona: number | null;
    readonly roles: readonly number[];
    readonly rowVersion: string;
}

export interface UsuarioUpdateResponse {
    readonly idUser: number;
    readonly rowVersion: string;
    readonly roleChanged: boolean;
    readonly sessionsRevoked: number;
    readonly mensaje: string;
}

export interface UsuarioChangeStatusResponse {
    readonly idUser: number;
    readonly isActive: boolean;
    readonly rowVersion: string;
    readonly sessionsRevoked: number;
    readonly mensaje: string;
}

export interface UsuarioResetPasswordResponse {
    readonly idUser: number;
    readonly username: string;
    readonly temporaryPassword: string;
    readonly mustChangePassword: boolean;
    readonly mensaje: string;
}

export interface UsuarioRevokeSessionResponse {
    readonly idUser: number;
    readonly username: string;
    readonly sessionsRevoked: number;
    readonly mensaje: string;
}
