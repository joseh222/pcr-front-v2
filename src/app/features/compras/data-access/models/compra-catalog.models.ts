export interface TipoComprobanteCompra {
    readonly idTipoComprobanteCompra: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly requiereSerie: boolean;
    readonly requiereNumero: boolean;
    readonly isActive: boolean;
}

export interface EstadoCompra {
    readonly idEstadoCompra: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly isActive: boolean;
}
