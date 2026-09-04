export interface MisaCalendarIntention {
    readonly idIntencion: number;
    readonly nombre: string | null;
    readonly observacion: string | null;
}

export interface MisaCalendarItem {
    readonly idMisa: number;
    readonly codMisa: string | null;
    readonly fecha: string;
    readonly hora: string;
    readonly idModalidad: number;
    readonly nombreModalidad: string;
    readonly idTipo: number;
    readonly codigoTipo: string;
    readonly nombreTipo: string;
    readonly idEstado: number;
    readonly nombreEstado: string;
    readonly idSolicitante: number;
    readonly nombreSolicitante: string | null;
    readonly idSolicitudServicio: number | null;
    readonly codSolicitudServicio: string | null;
    readonly requierePago: boolean | null;
    readonly estadoSolicitud: string | null;
    readonly estadoPago: string | null;
    readonly cantidadIntenciones: number;
    readonly motivo: string | null;
    readonly ofrecen: string | null;
    readonly celular: string | null;
    readonly devotos: string | null;
    readonly idSanto: number | null;
    readonly nombreSanto: string | null;
    readonly observaciones: string | null;
    readonly cerradaUtc: string | null;
    readonly programacionCerrada: boolean;
    readonly pagoConforme: boolean;
    readonly pendientePago: boolean;
    readonly puedeEditar: boolean;
    readonly puedeCobrar: boolean;
    readonly intenciones: readonly MisaCalendarIntention[];
}

export interface MisaCalendarResponse {
    readonly fechaInicio: string;
    readonly fechaFin: string;
    readonly items: readonly MisaCalendarItem[];
}


export interface MisaProgramStatusPending {
    readonly idMisa: number;
    readonly codMisa: string | null;
    readonly modalidad: string | null;
    readonly tipoMisa: string | null;
    readonly idSolicitudServicio: number | null;
    readonly codSolicitudServicio: string | null;
    readonly requierePago: boolean | null;
    readonly estadoSolicitud: string | null;
    readonly estadoPago: string | null;
    readonly motivoBloqueo: string;
}

export interface MisaProgramStatus {
    readonly idProgramacion: number | null;
    readonly fecha: string;
    readonly hora: string;
    readonly estadoProgramacion: 'ABIERTA' | 'CERRADA' | 'CELEBRADA' | string;
    readonly versionActual: number;
    readonly totalMisas: number;
    readonly totalPersonales: number;
    readonly totalComunitarias: number;
    readonly totalConformes: number;
    readonly totalPendientesPago: number;
    readonly totalSolicitudInvalida: number;
    readonly totalPagoInvalido: number;
    readonly programacionCerrada: boolean;
    readonly programacionCelebrada: boolean;
    readonly puedeCerrar: boolean;
    readonly puedeReabrir: boolean;
    readonly ultimaReaperturaUtc: string | null;
    readonly motivoUltimaReapertura: string | null;
    readonly codigo: string;
    readonly mensaje: string;
    readonly pendientes: readonly MisaProgramStatusPending[];
}

export interface MisaCloseProgramResponse {
    readonly fecha: string;
    readonly hora: string;
    readonly cantidadMisas: number;
    readonly estado: string;
    readonly mensaje: string;
}


export interface MisaReopenProgramRequest {
    readonly fecha: string;
    readonly hora: string;
    readonly motivo: string;
}

export interface MisaReopenProgramResponse {
    readonly fecha: string;
    readonly hora: string;
    readonly cantidadMisas: number;
    readonly estado: string;
    readonly versionActual: number;
    readonly mensaje: string;
}
