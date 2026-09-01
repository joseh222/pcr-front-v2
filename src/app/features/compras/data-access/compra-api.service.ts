import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { EstadoCompra, TipoComprobanteCompra } from './models/compra-catalog.models';
import { CompraCancelRequest, CompraCancelResponse } from './models/compra-cancel.models';
import { CompraDetailResponse, CompraListFilters, CompraListQuery, CompraPagedResponse } from './models/compra-read.models';
import { CompraCreateRequest, CompraCreateResponse } from './models/compra-write.models';
import { ProveedorSearchItem } from '../../proveedores/data-access/models/proveedor-read.models';
import { ProductoDetail, ProductoSearchItem } from '../../productos/data-access/models/producto-read.models';

@Injectable({ providedIn: 'root' })
export class CompraApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getEstados(): Observable<readonly EstadoCompra[]> { return this.http.get<readonly EstadoCompra[]>(`${this.url}/estados`); }
    getTiposComprobante(): Observable<readonly TipoComprobanteCompra[]> { return this.http.get<readonly TipoComprobanteCompra[]>(`${this.url}/tipos-comprobante`); }

    getList(query: CompraListQuery): Observable<CompraPagedResponse> {
        return this.http.get<CompraPagedResponse>(this.url, {
            params: this.buildFilterParams(query).set('pageNumber', query.pageNumber).set('pageSize', query.pageSize)
        });
    }

    exportExcel(filters: CompraListFilters): Observable<Blob> {
        return this.http.get(`${this.url}/exportar/excel`, { params: this.buildFilterParams(filters), responseType: 'blob' });
    }

    exportPdf(filters: CompraListFilters): Observable<Blob> {
        return this.http.get(`${this.url}/exportar/pdf`, { params: this.buildFilterParams(filters), responseType: 'blob' });
    }

    searchProveedores(search: string, top = 10): Observable<readonly ProveedorSearchItem[]> { const params = new HttpParams().set('search', search).set('top', top); return this.http.get<readonly ProveedorSearchItem[]>(`${this.url}/proveedores/search`, { params }); }
    searchProductos(search: string, top = 10): Observable<readonly ProductoSearchItem[]> { const params = new HttpParams().set('search', search).set('top', top); return this.http.get<readonly ProductoSearchItem[]>(`${this.url}/productos/search`, { params }); }
    getProductoById(idProducto: number): Observable<ProductoDetail> { return this.http.get<ProductoDetail>(`${this.url}/productos/${idProducto}`); }

    getById(idCompra: number): Observable<CompraDetailResponse> { return this.http.get<CompraDetailResponse>(`${this.url}/${idCompra}`); }
    create(request: CompraCreateRequest): Observable<CompraCreateResponse> { return this.http.post<CompraCreateResponse>(this.url, request); }
    cancel(idCompra: number, request: CompraCancelRequest): Observable<CompraCancelResponse> { return this.http.patch<CompraCancelResponse>(`${this.url}/${idCompra}/anular`, request); }

    private buildFilterParams(filters: CompraListFilters): HttpParams {
        let params = new HttpParams();
        if (filters.search?.trim()) params = params.set('search', filters.search.trim());
        if (filters.idProveedor != null) params = params.set('idProveedor', filters.idProveedor);
        if (filters.idTipoComprobanteCompra != null) params = params.set('idTipoComprobanteCompra', filters.idTipoComprobanteCompra);
        if (filters.idEstadoCompra != null) params = params.set('idEstadoCompra', filters.idEstadoCompra);
        if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio);
        if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin);
        return params;
    }

    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Compra`; }
}
