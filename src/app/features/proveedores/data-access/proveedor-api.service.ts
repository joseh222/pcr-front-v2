import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ProveedorTipoDocumento } from './models/proveedor-catalog.models';
import { ProveedorDetail, ProveedorListQuery, ProveedorPagedResponse, ProveedorSearchItem } from './models/proveedor-read.models';
import { ProveedorChangeStatusRequest, ProveedorChangeStatusResponse, ProveedorCreateRequest, ProveedorUpdateRequest, ProveedorWriteResponse } from './models/proveedor-write.models';

@Injectable({ providedIn: 'root' })
export class ProveedorApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getTiposDocumento(): Observable<readonly ProveedorTipoDocumento[]> {
        return this.http.get<readonly ProveedorTipoDocumento[]>(`${this.url}/tipos-documento`);
    }

    getList(query: ProveedorListQuery): Observable<ProveedorPagedResponse> {
        let params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
        if (query.search?.trim()) params = params.set('search', query.search.trim());
        if (query.idTipoDocumento !== null) params = params.set('idTipoDocumento', query.idTipoDocumento);
        if (query.isActive !== null) params = params.set('isActive', query.isActive);
        return this.http.get<ProveedorPagedResponse>(this.url, { params });
    }

    getById(idProveedor: number): Observable<ProveedorDetail> {
        return this.http.get<ProveedorDetail>(`${this.url}/${idProveedor}`);
    }

    search(search: string, top = 10): Observable<readonly ProveedorSearchItem[]> {
        const params = new HttpParams().set('search', search.trim()).set('top', top);
        return this.http.get<readonly ProveedorSearchItem[]>(`${this.url}/search`, { params });
    }

    create(request: ProveedorCreateRequest): Observable<ProveedorWriteResponse> {
        return this.http.post<ProveedorWriteResponse>(this.url, request);
    }

    update(idProveedor: number, request: ProveedorUpdateRequest): Observable<ProveedorWriteResponse> {
        return this.http.put<ProveedorWriteResponse>(`${this.url}/${idProveedor}`, request);
    }

    changeStatus(idProveedor: number, request: ProveedorChangeStatusRequest): Observable<ProveedorChangeStatusResponse> {
        return this.http.patch<ProveedorChangeStatusResponse>(`${this.url}/${idProveedor}/status`, request);
    }

    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Proveedor`; }
}
