export interface PersonaTipoDocumento {
    readonly idTipoDocumento: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly longitudMinima: number | null;
    readonly longitudMaxima: number | null;
    readonly soloNumeros: boolean;
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
