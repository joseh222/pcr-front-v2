import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ConfiguracionImpresion, ConfiguracionImpresionUpdateRequest } from './models/configuracion-impresion.models';
import { ConfiguracionSacramental, ConfiguracionSacramentalUpdateRequest } from './models/configuracion-sacramental.models';
import { CatalogoEstadoRequest, ConfiguracionParroquia, ConfiguracionParroquiaUpdateRequest, MantenimientoWriteResponse, MetodoPagoCreateRequest, MetodoPagoMantenimiento, MetodoPagoUpdateRequest, TipoComprobanteCreateRequest, TipoComprobanteMantenimiento, TipoComprobanteUpdateRequest } from './models/configuracion-mantenimientos.models';

@Injectable({ providedIn: 'root' })
export class ConfiguracionApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);
    getImpresion(): Observable<ConfiguracionImpresion> { return this.http.get<ConfiguracionImpresion>(`${this.url}/configuracion/impresion`); }
    updateImpresion(request: ConfiguracionImpresionUpdateRequest): Observable<ConfiguracionImpresion> { return this.http.put<ConfiguracionImpresion>(`${this.url}/configuracion/impresion`, request); }
    getSacramental(): Observable<ConfiguracionSacramental> { return this.http.get<ConfiguracionSacramental>(`${this.url}/configuracion/sacramental`); }
    updateSacramental(request: ConfiguracionSacramentalUpdateRequest): Observable<ConfiguracionSacramental> { return this.http.put<ConfiguracionSacramental>(`${this.url}/configuracion/sacramental`, request); }
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
    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/General`; }
}
