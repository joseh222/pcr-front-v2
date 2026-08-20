export type VentaTipoItem = 'PRODUCTO' | 'SERVICIO';

export interface VentaCreateItemRequest {
    readonly tipoItem: VentaTipoItem;
    readonly idProducto: number | null;
    readonly idSolicitudServicio: number | null;
    readonly cantidad: number;
}

export interface VentaCreateRequest {
    readonly idPersona: number | null;
    readonly idTipoComprobante: number;
    readonly idMetodoPago: number;
    readonly observaciones: string | null;
    readonly items: readonly VentaCreateItemRequest[];
}

export interface VentaCreateResponse {
    readonly idVenta: number;
    readonly codVenta: string;
    readonly serie: string;
    readonly correlativo: number;
    readonly numeroComprobante: string;
    readonly fechaVentaUtc: string;
    readonly subTotal: number;
    readonly impuesto: number;
    readonly total: number;
    readonly estadoVenta: string;
    readonly rowVersion: string;
    readonly mensaje: string;
}
