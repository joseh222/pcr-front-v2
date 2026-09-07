export interface ConfiguracionInicialEstado {
    configuracionInicialCompletada:boolean; configuracionInicialCompletadaUtc:string|null; configuracionInicialCompletadaBy:string|null;
    datosParroquiaOk:boolean; metodosPagoOk:boolean; cantidadMetodosPagoActivos:number;
    comprobantesSeriesOk:boolean; cantidadTiposComprobanteActivos:number; cantidadSeriesPredeterminadasActivas:number;
    serviciosOk:boolean; cantidadServiciosActivos:number; preciosMisaOk:boolean; cantidadPreciosMisaActivos:number;
    catalogosProductoOk:boolean; cantidadCategoriasProductoActivas:number; cantidadMarcasProductoActivas:number;
    impresionOk:boolean; impresionTicketConfigurada:boolean; impresionA4Configurada:boolean; colaHabilitada:boolean;
    pasosConfigurados:number; totalPasos:number; puedeFinalizar:boolean;
}
export interface ConfiguracionInicialFinalizarResponse { mensaje:string; estado:ConfiguracionInicialEstado; }
