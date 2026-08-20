export interface VentaRazonAnulacion {
    readonly idRazonAnulacion: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly requiereDetalle: boolean;
    readonly isActive: boolean;
}

export interface VentaCancelRequest {
    readonly idRazonAnulacion: number;
    readonly motivoAnulacion: string | null;
    readonly rowVersion: string;
}

export interface VentaCancelResponse {
    readonly idVenta: number;
    readonly codVenta: string;
    readonly estadoVenta: string;
    readonly idRazonAnulacion: number;
    readonly codigoRazonAnulacion: string;
    readonly motivoAnulacion: string | null;
    readonly anuladaUtc: string;
    readonly cantidadDetallesProducto: number;
    readonly cantidadUnidadesProducto: number;
    readonly cantidadServiciosReabiertos: number;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface VentaCancelTarget {
    readonly idVenta: number;
    readonly codVenta: string;
    readonly rowVersion: string;
}