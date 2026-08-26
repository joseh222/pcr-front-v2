export interface CompraCreateItemRequest {
    readonly idProducto: number;
    readonly cantidad: number;
    readonly costoUnitario: number;
}

export interface CompraCreateRequest {
    readonly idProveedor: number;
    readonly idTipoComprobanteCompra: number;
    readonly fechaCompra: string;
    readonly serieComprobante: string | null;
    readonly numeroComprobante: string | null;
    readonly observaciones: string | null;
    readonly items: readonly CompraCreateItemRequest[];
}

export interface CompraCreateResponse {
    readonly idCompra: number;
    readonly codCompra: string;
    readonly fechaCompra: string;
    readonly total: number;
    readonly estadoCompra: string;
    readonly rowVersion: string;
    readonly mensaje: string | null;
}
