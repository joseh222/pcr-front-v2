export interface RolListItem {
    readonly idRole: number;
    readonly code: string;
    readonly name: string;
    readonly description: string | null;
    readonly isActive: boolean;
    readonly isSystem: boolean;
    readonly grantsAllPermissions: boolean;
}

export interface PermisoItem {
    readonly idPermiso: number;
    readonly codigo: string;
    readonly modulo: string;
    readonly accion: string;
    readonly nombre: string;
    readonly descripcion: string | null;
    readonly orden: number;
    readonly isActive: boolean;
    readonly isSystem: boolean;
}

export interface RolPermisoItem extends PermisoItem { readonly isAssigned: boolean; }

export interface RolDetail extends RolListItem {
    readonly userCount: number;
    readonly permissionCount: number;
    readonly rowVersion: string;
}

export interface RolCreateRequest {
    readonly code: string;
    readonly name: string;
    readonly description: string | null;
}

export interface RolCreateResponse {
    readonly idRole: number;
    readonly code: string;
    readonly name: string;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface RolUpdateRequest {
    readonly name: string;
    readonly description: string | null;
    readonly rowVersion: string;
}

export interface RolUpdateResponse {
    readonly idRole: number;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface RolChangeStatusResponse {
    readonly idRole: number;
    readonly isActive: boolean;
    readonly affectedUsers: number;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface RolPermissionsUpdateResponse {
    readonly idRole: number;
    readonly permissionCount: number;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface RolListFilters {
    readonly search?: string | null;
    readonly isActive?: boolean | null;
}

export interface PermisoGroup {
    readonly module: string;
    readonly permissions: readonly PermisoItem[];
}
