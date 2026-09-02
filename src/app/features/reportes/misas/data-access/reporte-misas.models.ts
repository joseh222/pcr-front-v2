export type ReporteMisasEstadoPago = 'PAGADO' | 'PENDIENTE' | 'NO_REQUIERE_PAGO' | 'SIN_SOLICITUD';

export interface ReporteMisasFilters {
    fechaInicio: string;
    fechaFin: string;
    idModalidad: number | null;
    idTipo: number | null;
    idEstado: number | null;
    estadoPago: ReporteMisasEstadoPago | null;
}
export interface ReporteMisasModalidadItem { idModalidad: number; nombreModalidad: string; cantidadMisas: number; }
export interface ReporteMisasTipoItem { idTipo: number; codigoTipo: string; nombreTipo: string; cantidadMisas: number; }
export interface ReporteMisasEstadoItem { idEstado: number; nombreEstado: string; cantidadMisas: number; }
export interface ReporteMisasEstadoPagoItem { estadoPago: string; nombreEstadoPago: string; cantidadMisas: number; importe: number; }
export interface ReporteMisasDiaItem { fecha: string; cantidadMisas: number; cantidadPagadas: number; montoPagado: number; }
export interface ReporteMisasResponse {
    fechaInicio: string;
    fechaFin: string;
    cantidadMisas: number;
    cantidadPagadas: number;
    montoPagado: number;
    cantidadPendientesPago: number;
    montoPendiente: number;
    cantidadNoRequierenPago: number;
    cantidadCelebradas: number;
    cantidadSinSolicitud: number;
    modalidades: ReporteMisasModalidadItem[];
    tipos: ReporteMisasTipoItem[];
    estados: ReporteMisasEstadoItem[];
    estadosPago: ReporteMisasEstadoPagoItem[];
    tendenciaDiaria: ReporteMisasDiaItem[];
}
