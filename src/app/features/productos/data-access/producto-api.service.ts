import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ProductoCategoria, ProductoMarca } from './models/producto-catalog.models';
import { ProductoDetail, ProductoListQuery, ProductoPagedResponse, ProductoSearchItem } from './models/producto-read.models';
import { ProductoChangeStatusRequest, ProductoChangeStatusResponse, ProductoCreateRequest, ProductoUpdateRequest, ProductoWriteResponse } from './models/producto-write.models';

@Injectable({ providedIn: 'root' })
export class ProductoApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getCategorias(): Observable<readonly ProductoCategoria[]> {
        return this.http.get<readonly ProductoCategoria[]>(`${this.url}/categorias`);
    }
    getMarcas(): Observable<readonly ProductoMarca[]> {
        return this.http.get<readonly ProductoMarca[]>(`${this.url}/marcas`);
    }
    getById(idProducto: number): Observable<ProductoDetail> {
        return this.http.get<ProductoDetail>(`${this.url}/${idProducto}`);
    }
    search(search: string, top = 10): Observable<readonly ProductoSearchItem[]> {
        const params = new HttpParams().set('search', search.trim()).set('top', top);
        return this.http.get<readonly ProductoSearchItem[]>(`${this.url}/search`, { params });
    }
    create(request: ProductoCreateRequest): Observable<ProductoWriteResponse> {
        return this.http.post<ProductoWriteResponse>(this.url, request);
    }
    update(idProducto: number, request: ProductoUpdateRequest): Observable<ProductoWriteResponse> {
        return this.http.put<ProductoWriteResponse>(`${this.url}/${idProducto}`, request);
    }
    changeStatus(idProducto: number, request: ProductoChangeStatusRequest): Observable<ProductoChangeStatusResponse> {
        return this.http.patch<ProductoChangeStatusResponse>(`${this.url}/${idProducto}/status`, request);
    }

    getList(query: ProductoListQuery): Observable<ProductoPagedResponse> {
        let params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
        if (query.search?.trim()) params = params.set('search', query.search.trim());
        if (query.idCategoriaProducto != null) params = params.set('idCategoriaProducto', query.idCategoriaProducto);
        if (query.idMarcaProducto != null) params = params.set('idMarcaProducto', query.idMarcaProducto);
        if (query.isActive != null) params = params.set('isActive', query.isActive);
        return this.http.get<ProductoPagedResponse>(this.url, { params });
    }

    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Producto`; }
}
