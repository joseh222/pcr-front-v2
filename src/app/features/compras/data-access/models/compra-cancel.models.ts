export interface CompraCancelRequest {
    readonly motivoAnulacion: string;
    readonly rowVersion: string;
}

export interface CompraCancelResponse {
    readonly idCompra: number;
    readonly codCompra: string;
    readonly estadoCompra: string;
    readonly motivoAnulacion: string;
    readonly anuladaUtc: string;
    readonly cantidadDetalles: number;
    readonly cantidadUnidades: number;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface CompraCancelTarget {
    readonly idCompra: number;
    readonly codCompra: string;
    readonly rowVersion: string;
}
