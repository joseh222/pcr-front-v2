export interface ResumenEconomicoFilters { fechaInicio: string; fechaFin: string; }
export interface ResumenEconomicoMetodoPagoItem { idMetodoPago: number; nombreMetodoPago: string; cantidadVentas: number; totalIngresos: number; }
export interface ResumenEconomicoDiaItem { fecha: string; ingresos: number; egresos: number; saldo: number; }
export interface ResumenEconomicoComposicionItem { tipoItem: string; cantidadVentas: number; cantidadItems: number; totalDetalle: number; }
export interface ResumenEconomicoResponse {
    fechaInicio: string;
    fechaFin: string;
    cantidadVentas: number;
    totalIngresos: number;
    cantidadCompras: number;
    totalEgresos: number;
    saldoPeriodo: number;
    saldoSobreIngresosPorcentaje: number;
    metodosPago: ResumenEconomicoMetodoPagoItem[];
    flujoDiario: ResumenEconomicoDiaItem[];
    composicionVentas: ResumenEconomicoComposicionItem[];
}
