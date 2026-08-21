import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { CategoriaServicio } from './models/servicio-catalog.models';
import { ServicioDetail, ServicioListQuery, ServicioPagedResponse } from './models/servicio-read.models';
import { ServicioChangeStatusRequest, ServicioChangeStatusResponse, ServicioCreateRequest, ServicioUpdateRequest, ServicioWriteResponse } from './models/servicio-write.models';

@Injectable({ providedIn: 'root' })
export class ServicioApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getCategorias(): Observable<readonly CategoriaServicio[]> {
        return this.http.get<readonly CategoriaServicio[]>(`${this.url}/categorias`);
    }

    getList(query: ServicioListQuery): Observable<ServicioPagedResponse> {
        let params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
        if (query.search?.trim()) params = params.set('search', query.search.trim());
        if (query.idCategoriaServicio != null) params = params.set('idCategoriaServicio', query.idCategoriaServicio);
        if (query.modoPrecio) params = params.set('modoPrecio', query.modoPrecio);
        if (query.isActive != null) params = params.set('isActive', query.isActive);
        return this.http.get<ServicioPagedResponse>(this.url, { params });
    }

    getById(idServicio: number): Observable<ServicioDetail> {
        return this.http.get<ServicioDetail>(`${this.url}/${idServicio}`);
    }

    create(request: ServicioCreateRequest): Observable<ServicioWriteResponse> {
        return this.http.post<ServicioWriteResponse>(this.url, request);
    }

    update(idServicio: number, request: ServicioUpdateRequest): Observable<ServicioWriteResponse> {
        return this.http.put<ServicioWriteResponse>(`${this.url}/${idServicio}`, request);
    }

    changeStatus(idServicio: number, request: ServicioChangeStatusRequest): Observable<ServicioChangeStatusResponse> {
        return this.http.patch<ServicioChangeStatusResponse>(`${this.url}/${idServicio}/status`, request);
    }

    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Servicio`; }
}
