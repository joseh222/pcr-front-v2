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
    readonly importe: number;
    readonly createdUtc: string;
}

export interface VentaSolicitudDetalle extends VentaSolicitudPendiente {
    readonly modoPrecio: string;
    readonly requierePago: boolean;
    readonly motivoNoPago: string | null;
    readonly estadoSolicitud: string;
    readonly nombreEstadoSolicitud: string;
    readonly estadoPago: string;
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
