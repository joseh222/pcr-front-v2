export type ReporteVentaTipoItem = 'PRODUCTO' | 'SERVICIO';

export interface ReporteVentasFilters {
    fechaInicio: string;
    fechaFin: string;
    tipoItem: ReporteVentaTipoItem | null;
}

export interface ReporteVentasMetodoPagoItem {
    idMetodoPago: number;
    nombreMetodoPago: string;
    cantidadVentas: number;
    total: number;
}

export interface ReporteVentasDiaItem {
    fecha: string;
    cantidadVentas: number;
    total: number;
}

export interface ReporteVentasContenidoItem {
    contenido: string;
    cantidadVentas: number;
    total: number;
}

export interface ReporteVentasResponse {
    fechaInicio: string;
    fechaFin: string;
    cantidadVentas: number;
    totalVendido: number;
    ticketPromedio: number;
    cantidadAnuladas: number;
    totalAnulado: number;
    metodosPago: readonly ReporteVentasMetodoPagoItem[];
    tendenciaDiaria: readonly ReporteVentasDiaItem[];
    contenidos: readonly ReporteVentasContenidoItem[];
}
