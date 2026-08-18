export interface MisaModalidadRequest {
    readonly idModalidad: number;
}

export interface MisaTipoRequest {
    readonly idTipo: number;
}

export interface MisaSantoRequest {
    readonly idSanto: number;
}

export interface MisaSolicitanteRequest {
    readonly idPersona: number | null;
    readonly idTipoDocumento: number | null;
    readonly numeroDocumento: string | null;
    readonly nombre: string | null;
    readonly telefono: string | null;
}

export interface MisaCreateIntencionRequest {
    readonly nombre: string;
    readonly observacion: string | null;
}

export interface MisaUpdateIntencionRequest {
    readonly idIntencion: number;
    readonly nombre: string;
    readonly observacion: string | null;
}

interface MisaWriteRequest<TIntencion> {
    readonly modalidad: MisaModalidadRequest;
    readonly tipo: MisaTipoRequest;
    readonly solicitante: MisaSolicitanteRequest;
    readonly intenciones: readonly TIntencion[];

    readonly fecha: string;
    readonly hora: string;
    readonly observaciones: string | null;

    readonly requierePago: boolean;
    readonly motivoNoPago: string | null;

    readonly motivo: string | null;
    readonly ofrecen: string | null;
    readonly celular: string | null;
    readonly devotos: string | null;
    readonly santo: MisaSantoRequest | null;
}

export type MisaCreateRequest =
    MisaWriteRequest<MisaCreateIntencionRequest>;

export type MisaUpdateRequest =
    MisaWriteRequest<MisaUpdateIntencionRequest>;

export interface MisaCrudResponse {
    readonly idMisa: number | null;
    readonly mensaje: string | null;
}

export interface MisaWriteResponse extends MisaCrudResponse {
    readonly codMisa: string;
    readonly idSolicitudServicio: number;
    readonly codSolicitudServicio: string;
    readonly requierePago: boolean;
    readonly importe: number;
    readonly estadoPago: string;
}

export type MisaCreateResponse = MisaWriteResponse;
export type MisaUpdateResponse = MisaWriteResponse;

export interface MisaDeleteResponse extends MisaCrudResponse {
    readonly idSolicitudServicio: number;
    readonly codSolicitudServicio: string;
    readonly estadoSolicitud: string;
}