import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { EstadoCompra, TipoComprobanteCompra } from './models/compra-catalog.models';
import { CompraCancelRequest, CompraCancelResponse } from './models/compra-cancel.models';
import { CompraDetailResponse, CompraListQuery, CompraPagedResponse } from './models/compra-read.models';
import { CompraCreateRequest, CompraCreateResponse } from './models/compra-write.models';

@Injectable({ providedIn: 'root' })
export class CompraApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getEstados(): Observable<readonly EstadoCompra[]> { return this.http.get<readonly EstadoCompra[]>(`${this.url}/estados`); }
    getTiposComprobante(): Observable<readonly TipoComprobanteCompra[]> { return this.http.get<readonly TipoComprobanteCompra[]>(`${this.url}/tipos-comprobante`); }

    getList(query: CompraListQuery): Observable<CompraPagedResponse> {
        let params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
        if (query.search?.trim()) params = params.set('search', query.search.trim());
        if (query.idProveedor !== null) params = params.set('idProveedor', query.idProveedor);
        if (query.idTipoComprobanteCompra !== null) params = params.set('idTipoComprobanteCompra', query.idTipoComprobanteCompra);
        if (query.idEstadoCompra !== null) params = params.set('idEstadoCompra', query.idEstadoCompra);
        if (query.fechaInicio) params = params.set('fechaInicio', query.fechaInicio);
        if (query.fechaFin) params = params.set('fechaFin', query.fechaFin);
        return this.http.get<CompraPagedResponse>(this.url, { params });
    }

    getById(idCompra: number): Observable<CompraDetailResponse> { return this.http.get<CompraDetailResponse>(`${this.url}/${idCompra}`); }
    create(request: CompraCreateRequest): Observable<CompraCreateResponse> { return this.http.post<CompraCreateResponse>(this.url, request); }
    cancel(idCompra: number, request: CompraCancelRequest): Observable<CompraCancelResponse> { return this.http.patch<CompraCancelResponse>(`${this.url}/${idCompra}/anular`, request); }
    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Compra`; }
}
