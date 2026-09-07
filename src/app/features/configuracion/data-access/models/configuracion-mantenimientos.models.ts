export interface ConfiguracionParroquia {
    idConfiguracion: number; nombreParroquia: string | null; lugarExpedicion: string | null; direccion: string | null;
    distrito: string | null; provincia: string | null; departamento: string | null; telefono: string | null;
    correo: string | null; ruc: string | null; nombreParroco: string | null; configuracionInicialCompletada: boolean;
    configuracionInicialCompletadaUtc: string | null; configuracionInicialCompletadaBy: string | null;
    updatedUtc: string | null; updatedBy: string | null; rowVersion: string;
}
export interface ConfiguracionParroquiaUpdateRequest {
    nombreParroquia: string; lugarExpedicion: string; direccion: string | null; distrito: string | null;
    provincia: string | null; departamento: string | null; telefono: string | null; correo: string | null;
    ruc: string | null; nombreParroco: string | null; rowVersion: string;
}
export interface MetodoPagoMantenimiento {
    idMetodoPago: number; codigo: string; nombre: string; isActive: boolean; createdUtc: string;
    updatedUtc: string | null; updatedBy: string | null; rowVersion: string;
}
export interface TipoComprobanteMantenimiento {
    idTipoComprobante: number; codigo: string; nombre: string; serieDefault: string; isActive: boolean;
    ultimoNumero: number; tieneMovimientos: boolean; createdUtc: string; updatedUtc: string | null; updatedBy: string | null; rowVersion: string;
}
export interface MantenimientoWriteResponse { id: number; mensaje: string; rowVersion: string; }
export interface CatalogoEstadoRequest { isActive: boolean; rowVersion: string; }
export interface MetodoPagoCreateRequest { codigo: string; nombre: string; }
export interface MetodoPagoUpdateRequest extends MetodoPagoCreateRequest { rowVersion: string; }
export interface TipoComprobanteCreateRequest { codigo: string; nombre: string; serieDefault: string; }
export interface TipoComprobanteUpdateRequest extends TipoComprobanteCreateRequest { rowVersion: string; }

export interface SerieComprobanteMantenimiento {
    idTipoComprobante:number; codigoTipoComprobante:string; nombreTipoComprobante:string; serie:string; ultimoNumero:number; siguienteNumero:number;
    isActive:boolean; esPredeterminada:boolean; tieneMovimientos:boolean; createdUtc:string; updatedUtc:string|null; updatedBy:string|null;
    rowVersion:string; tipoRowVersion:string;
}
export interface SerieComprobanteCreateRequest { idTipoComprobante:number; serie:string; primerNumero:number; }
export interface SerieComprobanteInicioUpdateRequest { primerNumero:number; rowVersion:string; }
export interface SerieComprobanteDefaultRequest { tipoRowVersion:string; }
export interface MisaPrecioOpcion { idModalidad:number; nombreModalidad:string; idTipo:number; codigoTipo:string; nombreTipo:string; }
export interface MisaPrecioMantenimiento {
    idPrecio:number; idModalidad:number; nombreModalidad:string; idTipo:number; codigoTipo:string; nombreTipo:string; precio:number; modoCalculo:'FIJO'|'POR_INTENCION';
    fechaVigencia:string|null; fechaFin:string|null; esActivo:boolean; createdBy:string|null; updatedUtc:string|null; updatedBy:string|null; rowVersion:string;
}
export interface MisaPrecioCreateRequest { idModalidad:number; idTipo:number; precio:number; modoCalculo:'FIJO'|'POR_INTENCION'; }
export interface MisaPrecioDesactivarRequest { rowVersion:string; }
