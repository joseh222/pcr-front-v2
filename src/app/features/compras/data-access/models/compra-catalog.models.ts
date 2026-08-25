export interface TipoComprobanteCompra {
    readonly idTipoComprobanteCompra: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly requiereSerie: boolean;
    readonly requiereNumero: boolean;
    readonly isActive: boolean;
}
