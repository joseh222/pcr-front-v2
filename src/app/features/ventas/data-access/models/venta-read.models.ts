export type VentaTipoItemFiltro =
    'PRODUCTO' |
    'SERVICIO';

export interface VentaListFilters {
    readonly fechaInicio: string | null;
    readonly fechaFin: string | null;
    readonly idMetodoPago: number | null;
    readonly idTipoComprobante: number | null;
    readonly tipoItem: VentaTipoItemFiltro | null;
    readonly texto: string | null;
}

export interface VentaListQuery
    extends VentaListFilters {

    readonly pagina: number;
    readonly tamanoPagina: number;
}

export interface VentaListItem {
    readonly idVenta: number;
    readonly codVenta: string;
    readonly fechaVentaUtc: string;

    readonly idPersona: number | null;

    readonly tipoDocumentoCliente: string | null;
    readonly numeroDocumentoCliente: string | null;
    readonly nombreCliente: string | null;
    readonly telefonoCliente: string | null;

    readonly idTipoComprobante: number;
    readonly codigoTipoComprobante: string;
    readonly nombreTipoComprobante: string;

    readonly serie: string;
    readonly correlativo: number;
    readonly numeroComprobante: string;

    readonly idMetodoPago: number;
    readonly codigoMetodoPago: string;
    readonly nombreMetodoPago: string;

    readonly idEstadoVenta: number;
    readonly codigoEstadoVenta: string;
    readonly nombreEstadoVenta: string;

    readonly moneda: string;

    readonly subTotal: number;
    readonly impuesto: number;
    readonly total: number;

    readonly cantidadDetalles: number;
    readonly tieneProductos: boolean;
    readonly tieneServicios: boolean;

    readonly observaciones: string | null;

    readonly idRazonAnulacion: number | null;
    readonly codigoRazonAnulacion: string | null;
    readonly nombreRazonAnulacion: string | null;
    readonly motivoAnulacion: string | null;

    readonly anuladaUtc: string | null;
    readonly anuladaById: number | null;

    readonly createdUtc: string;
    readonly createdById: number;

    readonly puedeAnular: boolean;

    readonly rowVersion: string;
}

export interface VentaPagedResponse {
    readonly pagina: number;
    readonly tamanoPagina: number;
    readonly totalRegistros: number;
    readonly totalPaginas: number;
    readonly items:
    readonly VentaListItem[];
}

export interface VentaDetailItem {
    readonly idVentaDetalle: number;
    readonly tipoItem: string;
    readonly idProducto: number | null;
    readonly idSolicitudServicio: number | null;
    readonly codigo: string;
    readonly referencia: string | null;
    readonly descripcion: string;
    readonly cantidad: number;
    readonly precioUnitario: number;
    readonly subTotal: number;
}

export interface VentaDetailResponse extends VentaListItem {
    readonly detalles: readonly VentaDetailItem[];
}