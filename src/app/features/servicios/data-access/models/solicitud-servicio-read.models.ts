export interface SolicitudServicioListItem {
    readonly idSolicitudServicio: number;
    readonly codSolicitudServicio: string;
    readonly idServicio: number;
    readonly codigoServicio: string;
    readonly nombreServicio: string;
    readonly idPersona: number | null;
    readonly numeroDocumento: string | null;
    readonly nombreCompleto: string | null;
    readonly telefono: string | null;
    readonly requierePago: boolean;
    readonly importe: number;
    readonly estadoSolicitud: string;
    readonly estadoPago: string;
    readonly observaciones: string | null;
    readonly createdUtc: string;
    readonly rowVersion: string;
}

export interface SolicitudServicioPagedResponse {
    readonly items: readonly SolicitudServicioListItem[];
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly totalRecords: number;
    readonly totalPages: number;
}

export interface SolicitudServicioDetailResponse extends SolicitudServicioListItem {
    readonly modoPrecio: string;
    readonly motivoNoPago: string | null;
    readonly nombreEstadoSolicitud: string;
    readonly nombreEstadoPago: string;
    readonly updatedUtc: string | null;
    readonly createdById: number | null;
    readonly updatedById: number | null;
    readonly motivoAnulacion: string | null;
    readonly anuladaUtc: string | null;
    readonly anuladaById: number | null;
}

export interface SolicitudServicioListFilters {
    readonly search: string | null;
    readonly idServicio: number | null;
    readonly estadoSolicitud: string | null;
    readonly estadoPago: string | null;
    readonly requierePago: boolean | null;
    readonly fechaInicio: string | null;
    readonly fechaFin: string | null;
}

export interface SolicitudServicioListQuery extends SolicitudServicioListFilters {
    readonly pageNumber: number;
    readonly pageSize: number;
}
