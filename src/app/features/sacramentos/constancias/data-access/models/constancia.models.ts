
export type ConstanciaTipoSacramento = 'BAUTISMO' | 'CONFIRMACION' | 'MATRIMONIO';
export type ConstanciaAlineacion = 'LEFT' | 'CENTER' | 'RIGHT';
export type ConstanciaTipoConexion = 'USB' | 'RED' | 'COMPARTIDA';

export interface ConfiguracionConstancia {
    readonly nombreParroquia: string;
    readonly lugarExpedicion: string;
    readonly updatedUtc: string | null;
    readonly updatedBy: string | null;
    readonly rowVersion: string;
}

export interface ConfiguracionConstanciaUpdateRequest {
    readonly nombreParroquia: string;
    readonly lugarExpedicion: string;
    readonly rowVersion: string;
}

export interface ConfiguracionImpresionConstancia {
    readonly modo: 'MANUAL';
    readonly tipoConexion: ConstanciaTipoConexion;
    readonly nombreImpresoraWindows: string | null;
    readonly direccionIp: string | null;
    readonly puerto: number | null;
    readonly estaConfigurada: boolean;
    readonly updatedUtc: string | null;
    readonly updatedBy: string | null;
    readonly rowVersion: string;
}

export interface ConfiguracionImpresionConstanciaUpdateRequest {
    readonly tipoConexion: ConstanciaTipoConexion;
    readonly nombreImpresoraWindows: string;
    readonly direccionIp: string | null;
    readonly puerto: number | null;
    readonly rowVersion: string;
}

export interface ConfiguracionImpresionConstanciaUpdateResponse {
    readonly configuracion: ConfiguracionImpresionConstancia;
    readonly plantillasDescalibradas: number;
    readonly mensaje: string;
}

export interface ConstanciaImpresoraValidacion {
    readonly disponible: boolean;
    readonly impresora: string | null;
    readonly agente: string | null;
    readonly equipo: string | null;
    readonly ultimoContactoUtc: string | null;
    readonly mensaje: string;
}

export interface ConstanciaPlantillaCampo {
    readonly idConstanciaPlantillaCampo: number;
    readonly codigoCampo: string;
    readonly etiqueta: string;
    readonly xmm: number;
    readonly ymm: number;
    readonly anchoMm: number;
    readonly altoMm: number;
    readonly tamanoFuentePt: number;
    readonly alineacion: ConstanciaAlineacion;
    readonly maxLineas: number;
    readonly orden: number;
    readonly isActive: boolean;
    readonly rowVersion: string;
}

export interface ConstanciaPlantilla {
    readonly idConstanciaPlantilla: number;
    readonly idTipoSacramento: number;
    readonly codigoTipoSacramento: ConstanciaTipoSacramento;
    readonly nombreTipoSacramento: string;
    readonly anchoPapelMm: number;
    readonly altoPapelMm: number;
    readonly offsetGlobalXmm: number;
    readonly offsetGlobalYmm: number;
    readonly estaCalibrada: boolean;
    readonly isActive: boolean;
    readonly updatedUtc: string | null;
    readonly updatedBy: string | null;
    readonly rowVersion: string;
    readonly campos: readonly ConstanciaPlantillaCampo[];
}

export interface ConstanciaPlantillaCampoUpdateRequest {
    readonly codigoCampo: string;
    readonly xmm: number;
    readonly ymm: number;
    readonly anchoMm: number;
    readonly altoMm: number;
    readonly tamanoFuentePt: number;
    readonly alineacion: ConstanciaAlineacion;
    readonly maxLineas: number;
    readonly isActive: boolean;
}

export interface ConstanciaPlantillaUpdateRequest {
    readonly anchoPapelMm: number;
    readonly altoPapelMm: number;
    readonly offsetGlobalXmm: number;
    readonly offsetGlobalYmm: number;
    readonly estaCalibrada: false;
    readonly campos: readonly ConstanciaPlantillaCampoUpdateRequest[];
    readonly rowVersion: string;
}

export interface ConstanciaPlantillaEstadoRequest {
    readonly rowVersion: string;
}

export interface ConstanciaSacramental {
    readonly idConstanciaSacramental: number;
    readonly idSolicitudServicio: number;
    readonly codSolicitudServicio: string;
    readonly codigoTipoSacramento: ConstanciaTipoSacramento;
    readonly idRegistroSacramental: number;
    readonly fechaExpedicion: string;
    readonly cantidadSolicitada: number;
    readonly cantidadImpresaAcumulada: number;
    readonly numeroImpresiones: number;
    readonly primeraImpresionUtc: string | null;
    readonly ultimaImpresionUtc: string | null;
    readonly createdUtc: string;
    readonly rowVersion: string;
}


export type ConstanciaImpresionEstado = 'PENDIENTE' | 'PROCESANDO' | 'COMPLETADO' | 'ERROR';

export interface ConstanciaImpresionTrabajo {
    readonly idTrabajo: number;
    readonly tipoDocumento: 'CONSTANCIA_SACRAMENTAL' | 'CONSTANCIA_PRUEBA';
    readonly estado: ConstanciaImpresionEstado;
    readonly impresora: string;
    readonly cantidadCopias: number;
    readonly codigo: string;
    readonly mensaje: string;
}

export interface ConstanciaImpresionTrabajoEstado {
    readonly idTrabajo: number;
    readonly tipoDocumento: string;
    readonly entidadOrigen: string;
    readonly idOrigen: number;
    readonly codigoReferencia: string | null;
    readonly numeroSolicitud: number;
    readonly modoImpresion: 'MANUAL';
    readonly impresora: string;
    readonly estado: ConstanciaImpresionEstado;
    readonly intentos: number;
    readonly maxIntentos: number;
    readonly cantidadCopias: number;
    readonly fechaCreacionUtc: string;
    readonly fechaActualizacionUtc: string;
    readonly fechaFinalizacionUtc: string | null;
    readonly ultimoDetalle: string | null;
    readonly rowVersion: string;
}
