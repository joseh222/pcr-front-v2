import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ConfiguracionColaImpresion, ConfiguracionColaImpresionUpdateRequest, ConfiguracionImpresion, ConfiguracionImpresionUpdateRequest, ImpresionColaCancelarResponse, ImpresionColaResumen } from './models/configuracion-impresion.models';
import { ConfiguracionSacramental, ConfiguracionSacramentalUpdateRequest } from './models/configuracion-sacramental.models';
import { ConfiguracionInicialEstado, ConfiguracionInicialFinalizarResponse } from './models/configuracion-inicial.models';
import { ConfiguracionParroquiaIdentidad } from './models/configuracion-identidad.models';
import { CatalogoEstadoRequest, ConfiguracionParroquia, ConfiguracionParroquiaUpdateRequest, MantenimientoWriteResponse, MetodoPagoCreateRequest, MetodoPagoMantenimiento, MetodoPagoUpdateRequest, TipoComprobanteCreateRequest, TipoComprobanteMantenimiento, TipoComprobanteUpdateRequest, SerieComprobanteMantenimiento, SerieComprobanteCreateRequest, SerieComprobanteInicioUpdateRequest, SerieComprobanteDefaultRequest, MisaPrecioOpcion, MisaPrecioMantenimiento, MisaPrecioCreateRequest, MisaPrecioDesactivarRequest, CatalogoConfiguracionMantenimiento, CatalogoConfiguracionCreateRequest, CatalogoConfiguracionUpdateRequest } from './models/configuracion-mantenimientos.models';

@Injectable({ providedIn: 'root' })
export class ConfiguracionApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);
    getImpresion(): Observable<ConfiguracionImpresion> { return this.http.get<ConfiguracionImpresion>(`${this.url}/configuracion/impresion`); }
    updateImpresion(request: ConfiguracionImpresionUpdateRequest): Observable<ConfiguracionImpresion> { return this.http.put<ConfiguracionImpresion>(`${this.url}/configuracion/impresion`, request); }
    getColaImpresion(): Observable<ConfiguracionColaImpresion> { return this.http.get<ConfiguracionColaImpresion>(`${this.url}/configuracion/impresion/cola`); }
    updateColaImpresion(request: ConfiguracionColaImpresionUpdateRequest): Observable<ConfiguracionColaImpresion> { return this.http.put<ConfiguracionColaImpresion>(`${this.url}/configuracion/impresion/cola`, request); }
    getResumenColaImpresion(): Observable<ImpresionColaResumen> { return this.http.get<ImpresionColaResumen>(`${this.url}/configuracion/impresion/cola/resumen`); }
    cancelarPendientesColaImpresion(): Observable<ImpresionColaCancelarResponse> { return this.http.post<ImpresionColaCancelarResponse>(`${this.url}/configuracion/impresion/cola/cancelar-pendientes`, {}); }
    getSacramental(): Observable<ConfiguracionSacramental> { return this.http.get<ConfiguracionSacramental>(`${this.url}/configuracion/sacramental`); }
    updateSacramental(request: ConfiguracionSacramentalUpdateRequest): Observable<ConfiguracionSacramental> { return this.http.put<ConfiguracionSacramental>(`${this.url}/configuracion/sacramental`, request); }
    getConfiguracionInicialEstado(): Observable<ConfiguracionInicialEstado> { return this.http.get<ConfiguracionInicialEstado>(`${this.url}/configuracion/inicial/estado`); }
    finalizarConfiguracionInicial(): Observable<ConfiguracionInicialFinalizarResponse> { return this.http.post<ConfiguracionInicialFinalizarResponse>(`${this.url}/configuracion/inicial/finalizar`, {}); }
    getIdentidadParroquia(): Observable<ConfiguracionParroquiaIdentidad> { return this.http.get<ConfiguracionParroquiaIdentidad>(`${this.url}/configuracion/parroquia/identidad`); }
    getParroquia(): Observable<ConfiguracionParroquia> { return this.http.get<ConfiguracionParroquia>(`${this.url}/configuracion/parroquia`); }
    updateParroquia(request: ConfiguracionParroquiaUpdateRequest): Observable<ConfiguracionParroquia> { return this.http.put<ConfiguracionParroquia>(`${this.url}/configuracion/parroquia`, request); }
    getMetodosPago(): Observable<readonly MetodoPagoMantenimiento[]> { return this.http.get<readonly MetodoPagoMantenimiento[]>(`${this.url}/configuracion/metodos-pago`); }
    createMetodoPago(request: MetodoPagoCreateRequest): Observable<MantenimientoWriteResponse> { return this.http.post<MantenimientoWriteResponse>(`${this.url}/configuracion/metodos-pago`, request); }
    updateMetodoPago(id: number, request: MetodoPagoUpdateRequest): Observable<MantenimientoWriteResponse> { return this.http.put<MantenimientoWriteResponse>(`${this.url}/configuracion/metodos-pago/${id}`, request); }
    changeMetodoPagoStatus(id: number, request: CatalogoEstadoRequest): Observable<MantenimientoWriteResponse> { return this.http.patch<MantenimientoWriteResponse>(`${this.url}/configuracion/metodos-pago/${id}/estado`, request); }
    getTiposComprobante(): Observable<readonly TipoComprobanteMantenimiento[]> { return this.http.get<readonly TipoComprobanteMantenimiento[]>(`${this.url}/configuracion/tipos-comprobante`); }
    createTipoComprobante(request: TipoComprobanteCreateRequest): Observable<MantenimientoWriteResponse> { return this.http.post<MantenimientoWriteResponse>(`${this.url}/configuracion/tipos-comprobante`, request); }
    updateTipoComprobante(id: number, request: TipoComprobanteUpdateRequest): Observable<MantenimientoWriteResponse> { return this.http.put<MantenimientoWriteResponse>(`${this.url}/configuracion/tipos-comprobante/${id}`, request); }
    changeTipoComprobanteStatus(id: number, request: CatalogoEstadoRequest): Observable<MantenimientoWriteResponse> { return this.http.patch<MantenimientoWriteResponse>(`${this.url}/configuracion/tipos-comprobante/${id}/estado`, request); }
    getSeriesComprobante(idTipoComprobante?: number): Observable<readonly SerieComprobanteMantenimiento[]> { const suffix=idTipoComprobante?`?idTipoComprobante=${idTipoComprobante}`:''; return this.http.get<readonly SerieComprobanteMantenimiento[]>(`${this.url}/configuracion/series-comprobante${suffix}`); }
    createSerieComprobante(request: SerieComprobanteCreateRequest): Observable<MantenimientoWriteResponse> { return this.http.post<MantenimientoWriteResponse>(`${this.url}/configuracion/series-comprobante`,request); }
    updateSerieInicio(idTipoComprobante:number,serie:string,request:SerieComprobanteInicioUpdateRequest): Observable<MantenimientoWriteResponse> { return this.http.put<MantenimientoWriteResponse>(`${this.url}/configuracion/series-comprobante/${idTipoComprobante}/${encodeURIComponent(serie)}/inicio`,request); }
    changeSerieStatus(idTipoComprobante:number,serie:string,request:CatalogoEstadoRequest): Observable<MantenimientoWriteResponse> { return this.http.patch<MantenimientoWriteResponse>(`${this.url}/configuracion/series-comprobante/${idTipoComprobante}/${encodeURIComponent(serie)}/estado`,request); }
    setSerieDefault(idTipoComprobante:number,serie:string,request:SerieComprobanteDefaultRequest): Observable<MantenimientoWriteResponse> { return this.http.patch<MantenimientoWriteResponse>(`${this.url}/configuracion/series-comprobante/${idTipoComprobante}/${encodeURIComponent(serie)}/predeterminada`,request); }
    getMisaPrecioOpciones(): Observable<readonly MisaPrecioOpcion[]> { return this.http.get<readonly MisaPrecioOpcion[]>(`${this.url}/configuracion/precios-misa/opciones`); }
    getMisaPrecios(): Observable<readonly MisaPrecioMantenimiento[]> { return this.http.get<readonly MisaPrecioMantenimiento[]>(`${this.url}/configuracion/precios-misa`); }
    createMisaPrecio(request:MisaPrecioCreateRequest): Observable<MantenimientoWriteResponse> { return this.http.post<MantenimientoWriteResponse>(`${this.url}/configuracion/precios-misa`,request); }
    deactivateMisaPrecio(idPrecio:number,request:MisaPrecioDesactivarRequest): Observable<MantenimientoWriteResponse> { return this.http.patch<MantenimientoWriteResponse>(`${this.url}/configuracion/precios-misa/${idPrecio}/desactivar`,request); }
    getCategoriasServicio(): Observable<readonly CatalogoConfiguracionMantenimiento[]> { return this.http.get<readonly CatalogoConfiguracionMantenimiento[]>(`${this.url}/configuracion/categorias-servicio`); }
    createCategoriaServicio(request:CatalogoConfiguracionCreateRequest): Observable<MantenimientoWriteResponse> { return this.http.post<MantenimientoWriteResponse>(`${this.url}/configuracion/categorias-servicio`,request); }
    updateCategoriaServicio(id:number,request:CatalogoConfiguracionUpdateRequest): Observable<MantenimientoWriteResponse> { return this.http.put<MantenimientoWriteResponse>(`${this.url}/configuracion/categorias-servicio/${id}`,request); }
    changeCategoriaServicioStatus(id:number,request:CatalogoEstadoRequest): Observable<MantenimientoWriteResponse> { return this.http.patch<MantenimientoWriteResponse>(`${this.url}/configuracion/categorias-servicio/${id}/estado`,request); }
    getCategoriasProducto(): Observable<readonly CatalogoConfiguracionMantenimiento[]> { return this.http.get<readonly CatalogoConfiguracionMantenimiento[]>(`${this.url}/configuracion/categorias-producto`); }
    createCategoriaProducto(request:CatalogoConfiguracionCreateRequest): Observable<MantenimientoWriteResponse> { return this.http.post<MantenimientoWriteResponse>(`${this.url}/configuracion/categorias-producto`,request); }
    updateCategoriaProducto(id:number,request:CatalogoConfiguracionUpdateRequest): Observable<MantenimientoWriteResponse> { return this.http.put<MantenimientoWriteResponse>(`${this.url}/configuracion/categorias-producto/${id}`,request); }
    changeCategoriaProductoStatus(id:number,request:CatalogoEstadoRequest): Observable<MantenimientoWriteResponse> { return this.http.patch<MantenimientoWriteResponse>(`${this.url}/configuracion/categorias-producto/${id}/estado`,request); }
    getMarcasProducto(): Observable<readonly CatalogoConfiguracionMantenimiento[]> { return this.http.get<readonly CatalogoConfiguracionMantenimiento[]>(`${this.url}/configuracion/marcas-producto`); }
    createMarcaProducto(request:CatalogoConfiguracionCreateRequest): Observable<MantenimientoWriteResponse> { return this.http.post<MantenimientoWriteResponse>(`${this.url}/configuracion/marcas-producto`,request); }
    updateMarcaProducto(id:number,request:CatalogoConfiguracionUpdateRequest): Observable<MantenimientoWriteResponse> { return this.http.put<MantenimientoWriteResponse>(`${this.url}/configuracion/marcas-producto/${id}`,request); }
    changeMarcaProductoStatus(id:number,request:CatalogoEstadoRequest): Observable<MantenimientoWriteResponse> { return this.http.patch<MantenimientoWriteResponse>(`${this.url}/configuracion/marcas-producto/${id}/estado`,request); }
    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/General`; }
}
