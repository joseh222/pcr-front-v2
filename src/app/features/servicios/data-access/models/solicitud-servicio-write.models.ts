export interface SolicitudServicioCreateRequest {
    readonly idServicio: number;
    readonly idPersona: number | null;
    readonly requierePago: boolean;
    readonly importe: number | null;
    readonly motivoNoPago: string | null;
    readonly observaciones: string | null;
}

export interface SolicitudServicioUpdateRequest {
    readonly idPersona: number | null;
    readonly requierePago: boolean;
    readonly importe: number | null;
    readonly motivoNoPago: string | null;
    readonly observaciones: string | null;
    readonly rowVersion: string;
}

export interface SolicitudServicioCreateResponse {
    readonly idSolicitudServicio: number;
    readonly codSolicitudServicio: string;
    readonly codigoServicio: string;
    readonly nombreServicio: string;
    readonly requierePago: boolean;
    readonly importe: number;
    readonly motivoNoPago: string | null;
    readonly estadoSolicitud: string;
    readonly estadoPago: string;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface SolicitudServicioUpdateResponse {
    readonly idSolicitudServicio: number;
    readonly codSolicitudServicio: string;
    readonly requierePago: boolean;
    readonly importe: number;
    readonly motivoNoPago: string | null;
    readonly estadoPago: string;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface SolicitudServicioAnularRequest {
    readonly motivo: string;
    readonly rowVersion: string;
}

export interface SolicitudServicioAnularResponse {
    readonly idSolicitudServicio: number;
    readonly codSolicitudServicio: string;
    readonly estadoSolicitud: string;
    readonly motivoAnulacion: string | null;
    readonly anuladaUtc: string | null;
    readonly rowVersion: string;
    readonly mensaje: string;
}
