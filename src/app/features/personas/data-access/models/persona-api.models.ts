export interface PersonaTipoDocumento {
    readonly idTipoDocumento: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly longitudMinima: number | null;
    readonly longitudMaxima: number | null;
    readonly soloNumeros: boolean;
    readonly isActive: boolean;
}

export interface PersonaRolCatalogo {
    readonly idRolPersona: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly descripcion: string | null;
    readonly isActive: boolean;
}

export interface PersonaLookup {
    readonly idPersona: number;
    readonly codPersona: string | null;
    readonly idTipoDocumento: number | null;
    readonly codigoTipoDocumento: string | null;
    readonly nombreTipoDocumento: string | null;
    readonly numeroDocumento: string | null;
    readonly nombreCompleto: string | null;
    readonly fechaNacimiento: string | null;
    readonly telefono: string | null;
    readonly email: string | null;
    readonly direccion: string | null;
    readonly isActive: boolean;
    readonly rowVersion: string;
}

export interface PersonaSearchItem {
    readonly idPersona: number;
    readonly codPersona: string | null;
    readonly idTipoDocumento: number | null;
    readonly codigoTipoDocumento: string | null;
    readonly numeroDocumento: string | null;
    readonly nombreCompleto: string | null;
    readonly fechaNacimiento: string | null;
    readonly telefono: string | null;
    readonly email: string | null;
    readonly rolesPersona: string | null;
}

export interface PersonaListFilters {
    readonly search?: string | null;
    readonly idTipoDocumento?: number | null;
    readonly idRolPersona?: number | null;
    readonly isActive?: boolean | null;
}

export interface PersonaListQuery extends PersonaListFilters {
    readonly pageNumber: number;
    readonly pageSize: number;
}

export interface PersonaListItem {
    readonly idPersona: number;
    readonly codPersona: string | null;
    readonly idTipoDocumento: number | null;
    readonly codigoTipoDocumento: string | null;
    readonly nombreTipoDocumento: string | null;
    readonly numeroDocumento: string | null;
    readonly nombreCompleto: string | null;
    readonly fechaNacimiento: string | null;
    readonly telefono: string | null;
    readonly email: string | null;
    readonly direccion: string | null;
    readonly isActive: boolean;
    readonly rolesPersona: string | null;
    readonly rowVersion: string;
}

export interface PersonaPagedResponse {
    readonly items: readonly PersonaListItem[];
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly totalRecords: number;
    readonly totalPages: number;
}

export interface PersonaRole {
    readonly idRolPersona: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly descripcion: string | null;
}

export interface PersonaDetail {
    readonly idPersona: number;
    readonly codPersona: string | null;
    readonly idTipoDocumento: number | null;
    readonly codigoTipoDocumento: string | null;
    readonly nombreTipoDocumento: string | null;
    readonly numeroDocumento: string | null;
    readonly nombreCompleto: string | null;
    readonly fechaNacimiento: string | null;
    readonly telefono: string | null;
    readonly email: string | null;
    readonly direccion: string | null;
    readonly isActive: boolean;
    readonly createdUtc: string;
    readonly updatedUtc: string | null;
    readonly roles: readonly PersonaRole[];
    readonly rowVersion: string;
}

export interface PersonaCreateRequest {
    readonly idTipoDocumento: number | null;
    readonly numeroDocumento: string | null;
    readonly nombreCompleto: string | null;
    readonly fechaNacimiento: string | null;
    readonly telefono: string | null;
    readonly email: string | null;
    readonly direccion: string | null;
    readonly roles: readonly number[];
}

export interface PersonaCreateResponse {
    readonly idPersona: number;
    readonly codPersona: string;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface PersonaUpdateRequest {
    readonly idTipoDocumento: number | null;
    readonly numeroDocumento: string | null;
    readonly nombreCompleto: string | null;
    readonly fechaNacimiento: string | null;
    readonly telefono: string | null;
    readonly email: string | null;
    readonly direccion: string | null;
    readonly roles: readonly number[] | null;
    readonly rowVersion: string;
}

export interface PersonaUpdateResponse {
    readonly idPersona: number;
    readonly codPersona: string;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface PersonaChangeStatusRequest {
    readonly isActive: boolean;
    readonly rowVersion: string;
}

export interface PersonaChangeStatusResponse {
    readonly idPersona: number;
    readonly isActive: boolean;
    readonly rowVersion: string;
    readonly mensaje: string;
}
