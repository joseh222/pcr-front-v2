export interface VentaSolicitudPendiente {
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
    readonly cantidad: number;
    readonly importe: number;
    readonly importeTotal: number;
    readonly estadoSolicitud: string;
    readonly estadoPago: string;
    readonly idTipoSacramentoRequerido: number | null;
    readonly codigoTipoSacramentoRequerido: string | null;
    readonly nombreTipoSacramentoRequerido: string | null;
    readonly requiereRegistroSacramental: boolean;
    readonly tieneRegistroSacramental: boolean;
    readonly codigoTipoSacramentoRegistro: string | null;
    readonly idRegistroSacramental: number | null;
    readonly nombreRegistroSacramental: string | null;
    readonly numeroLibroRegistro: string | null;
    readonly numeroFolioRegistro: string | null;
    readonly numeroPartidaRegistro: string | null;
    readonly puedeCobrar: boolean;
    readonly motivoNoCobrable: string | null;
    readonly createdUtc: string;
}

export interface VentaSolicitudDetalle extends VentaSolicitudPendiente {
    readonly modoPrecio: string;
    readonly motivoNoPago: string | null;
    readonly nombreEstadoSolicitud: string;
    readonly nombreEstadoPago: string;
    readonly observaciones: string | null;
    readonly updatedUtc: string | null;
    readonly createdById: number | null;
    readonly updatedById: number | null;
    readonly motivoAnulacion: string | null;
    readonly anuladaUtc: string | null;
    readonly anuladaById: number | null;
    readonly rowVersion: string;
}

export interface VentaProductoBusqueda {
    readonly idProducto: number;
    readonly codProducto: string;
    readonly nombre: string;
    readonly sku: string | null;
    readonly idCategoriaProducto: number;
    readonly nombreCategoria: string;
    readonly idMarcaProducto: number | null;
    readonly nombreMarca: string | null;
    readonly precioVenta: number;
    readonly stockActual: number;
}
