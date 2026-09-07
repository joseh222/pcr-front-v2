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
