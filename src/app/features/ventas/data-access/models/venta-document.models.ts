export type VentaDocumentoTipo = 'VENTA_TICKET' | 'MISA_REGISTRO';

export interface VentaDocumentoMisaIntencion {
    readonly idIntencion: number;
    readonly nombre: string;
    readonly observacion: string | null;
}

export interface VentaDocumentoMisa {
    readonly idMisa: number;
    readonly codMisa: string;
    readonly modalidad: string | null;
    readonly tipo: string | null;
    readonly intenciones: readonly VentaDocumentoMisaIntencion[];
}

export interface VentaDocumentoItem {
    readonly tipo: VentaDocumentoTipo;
    readonly titulo: string;
    readonly orden: number;
    readonly codigoReferencia: string | null;
    readonly cantidadSolicitudesImpresion: number;
    readonly cantidadImpresionesConfirmadas: number;
    readonly ultimaSolicitudUtc: string | null;
    readonly estadoUltimoTrabajo: 'PENDIENTE' | 'PROCESANDO' | 'COMPLETADO' | 'ERROR' | null;
    readonly intentosUltimoTrabajo: number | null;
    readonly maxIntentosUltimoTrabajo: number | null;
    readonly ultimoErrorTrabajo: string | null;
    readonly ultimoTrabajoUtc: string | null;
    readonly misas: readonly VentaDocumentoMisa[];
}

export interface VentaDocumentosResponse {
    readonly idVenta: number;
    readonly codVenta: string;
    readonly totalDocumentos: number;
    readonly tieneDocumentosAdicionales: boolean;
    readonly documentos: readonly VentaDocumentoItem[];
}

export interface DocumentoImpresionResponse {
    readonly tipoDocumento: VentaDocumentoTipo;
    readonly numeroSolicitud: number;
    readonly esReimpresion: boolean;
    readonly fechaUtc: string;
    readonly mensaje: string;
}

export interface DocumentoImpresionEjecucionResponse {
    readonly tipoDocumento: VentaDocumentoTipo;
    readonly numeroSolicitud: number;
    readonly idTrabajo: number | null;
    readonly exitosa: boolean;
    readonly estado: string;
    readonly impresora: string;
    readonly mensaje: string;
}

export interface VentaImpresionModoResponse { readonly modo: 'MANUAL' | 'AUTOMATICO'; readonly isActive: boolean; }
