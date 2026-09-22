export interface VentaMetodoPago {
    readonly idMetodoPago: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly isActive: boolean;
    readonly esPredeterminado: boolean;
}

export interface VentaTipoComprobante {
    readonly idTipoComprobante: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly serieDefault: string;
    readonly isActive: boolean;
}
