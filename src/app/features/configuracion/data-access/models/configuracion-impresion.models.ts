export type ModoImpresion = 'MANUAL' | 'AUTOMATICO';
export type TipoConexionImpresora = 'RED' | 'USB' | 'COMPARTIDA';

export interface ConfiguracionImpresion {
    readonly modo: ModoImpresion;
    readonly motor: 'PRINT_AGENT';
    readonly tipoConexion: TipoConexionImpresora;
    readonly nombreImpresoraWindows: string;
    readonly direccionIp: string | null;
    readonly puerto: number | null;
    readonly anchoPapelMm: number;
    readonly imprimirTicketVenta: boolean;
    readonly imprimirDocumentosAsociados: boolean;
    readonly cortarEntreDocumentos: boolean;
    readonly isActive: boolean;
    readonly updatedUtc: string | null;
    readonly updatedBy: string | null;
    readonly rowVersion: string;
}

export interface ConfiguracionImpresionUpdateRequest {
    readonly modo: ModoImpresion;
    readonly tipoConexion: TipoConexionImpresora;
    readonly nombreImpresoraWindows: string;
    readonly direccionIp: string | null;
    readonly puerto: number | null;
    readonly anchoPapelMm: number;
    readonly imprimirTicketVenta: boolean;
    readonly imprimirDocumentosAsociados: boolean;
    readonly cortarEntreDocumentos: boolean;
    readonly isActive: boolean;
    readonly rowVersion: string;
}
