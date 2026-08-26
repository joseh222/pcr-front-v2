export interface CompraListFilters {
    readonly search: string | null;
    readonly idProveedor: number | null;
    readonly idTipoComprobanteCompra: number | null;
    readonly idEstadoCompra: number | null;
    readonly fechaInicio: string | null;
    readonly fechaFin: string | null;
}

export interface CompraListQuery extends CompraListFilters {
    readonly pageNumber: number;
    readonly pageSize: number;
}

export interface CompraListItem {
    readonly idCompra: number;
    readonly codCompra: string;
    readonly fechaCompra: string;
    readonly idProveedor: number;
    readonly tipoDocumentoProveedor: string | null;
    readonly numeroDocumentoProveedor: string | null;
    readonly razonSocialProveedor: string;
    readonly nombreComercialProveedor: string | null;
    readonly idTipoComprobanteCompra: number;
    readonly codigoTipoComprobante: string;
    readonly nombreTipoComprobante: string;
    readonly serieComprobante: string | null;
    readonly numeroComprobante: string | null;
    readonly idEstadoCompra: number;
    readonly codigoEstadoCompra: string;
    readonly nombreEstadoCompra: string;
    readonly moneda: string;
    readonly total: number;
    readonly cantidadDetalles: number;
    readonly cantidadTotal: number;
    readonly observaciones: string | null;
    readonly motivoAnulacion: string | null;
    readonly anuladaUtc: string | null;
    readonly anuladaById: number | null;
    readonly createdUtc: string;
    readonly createdById: number;
    readonly puedeAnular: boolean;
    readonly rowVersion: string;
}

export interface CompraPagedResponse {
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly totalRows: number;
    readonly totalPages: number;
    readonly items: readonly CompraListItem[];
}

export interface CompraDetailItem {
    readonly idCompraDetalle: number;
    readonly idProducto: number;
    readonly codigoProducto: string | null;
    readonly sku: string | null;
    readonly descripcion: string;
    readonly cantidad: number;
    readonly costoUnitario: number;
    readonly subTotal: number;
}

export interface CompraDetailResponse {
    readonly idCompra: number;
    readonly codCompra: string;
    readonly fechaCompra: string;
    readonly idProveedor: number;
    readonly tipoDocumentoProveedor: string | null;
    readonly numeroDocumentoProveedor: string | null;
    readonly razonSocialProveedor: string;
    readonly nombreComercialProveedor: string | null;
    readonly idTipoComprobanteCompra: number;
    readonly codigoTipoComprobante: string;
    readonly nombreTipoComprobante: string;
    readonly serieComprobante: string | null;
    readonly numeroComprobante: string | null;
    readonly idEstadoCompra: number;
    readonly codigoEstadoCompra: string;
    readonly nombreEstadoCompra: string;
    readonly moneda: string;
    readonly total: number;
    readonly cantidadDetalles: number;
    readonly cantidadTotal: number;
    readonly observaciones: string | null;
    readonly motivoAnulacion: string | null;
    readonly anuladaUtc: string | null;
    readonly anuladaById: number | null;
    readonly createdUtc: string;
    readonly createdById: number;
    readonly puedeAnular: boolean;
    readonly rowVersion: string;
    readonly detalles: readonly CompraDetailItem[];
}
