import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { VentaMetodoPago, VentaTipoComprobante } from './models/venta-catalog.models';
import { VentaProductoBusqueda, VentaSolicitudDetalle, VentaSolicitudPendiente } from './models/venta-lookup.models';
import { VentaCreateRequest, VentaCreateResponse } from './models/venta-write.models';
import { VentaListQuery, VentaPagedResponse } from './models/venta-read.models';

@Injectable({ providedIn: 'root' })
export class VentaApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getMetodosPago(): Observable<readonly VentaMetodoPago[]> {
        return this.http.get<readonly VentaMetodoPago[]>(`${this.ventaUrl}/metodos-pago`);
    }

    getTiposComprobante(): Observable<readonly VentaTipoComprobante[]> {
        return this.http.get<readonly VentaTipoComprobante[]>(`${this.ventaUrl}/tipos-comprobante`);
    }

    searchServiciosPendientes(search: string, top = 20): Observable<readonly VentaSolicitudPendiente[]> {
        const params = new HttpParams().set('search', search).set('top', top);
        return this.http.get<readonly VentaSolicitudPendiente[]>(`${this.solicitudUrl}/pendientes`, { params });
    }

    getSolicitudById(idSolicitudServicio: number): Observable<VentaSolicitudDetalle> {
        return this.http.get<VentaSolicitudDetalle>(`${this.solicitudUrl}/${idSolicitudServicio}`);
    }

    searchProductos(search: string, top = 10): Observable<readonly VentaProductoBusqueda[]> {
        const params = new HttpParams().set('search', search).set('top', top);
        return this.http.get<readonly VentaProductoBusqueda[]>(`${this.productoUrl}/search`, { params });
    }

    create(request: VentaCreateRequest): Observable<VentaCreateResponse> {
        return this.http.post<VentaCreateResponse>(this.ventaUrl, request);
    }

    getList(query: VentaListQuery): Observable<VentaPagedResponse> {
        return this.http.get<VentaPagedResponse>(this.ventaUrl,
            {
                params: this.buildListParams(query)
            }
        );
    }

    private buildListParams(query: VentaListQuery): HttpParams {
        let params = new HttpParams()
            .set('pagina', query.pagina)
            .set('tamanoPagina', query.tamanoPagina);

        if (query.fechaInicio) {
            params = params.set('fechaInicio', query.fechaInicio);
        }

        if (query.fechaFin) {
            params = params.set('fechaFin', query.fechaFin);
        }

        if (
            query.idMetodoPago != null) {
            params = params.set('idMetodoPago', query.idMetodoPago);
        }

        if (query.idTipoComprobante != null) {
            params = params.set('idTipoComprobante', query.idTipoComprobante);
        }

        if (query.tipoItem) {
            params = params.set('tipoItem', query.tipoItem);
        }

        if (query.texto?.trim()) {
            params = params.set('texto', query.texto.trim());
        }

        return params;
    }

    private get ventaUrl(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Venta`; }
    private get solicitudUrl(): string { return `${this.runtimeConfig.config.apiBaseUrl}/SolicitudServicio`; }
    private get productoUrl(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Producto`; }
}
