import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import {
    PersonaChangeStatusRequest,
    PersonaChangeStatusResponse,
    PersonaCreateRequest,
    PersonaCreateResponse,
    PersonaDetail,
    PersonaListQuery,
    PersonaLookup,
    PersonaPagedResponse,
    PersonaRolCatalogo,
    PersonaSearchItem,
    PersonaTipoDocumento,
    PersonaUpdateRequest,
    PersonaUpdateResponse
} from './models/persona-api.models';

@Injectable({ providedIn: 'root' })
export class PersonaApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getTiposDocumento(): Observable<readonly PersonaTipoDocumento[]> {
        return this.http.get<readonly PersonaTipoDocumento[]>(`${this.apiUrl}/tipos-documento`);
    }

    getRoles(): Observable<readonly PersonaRolCatalogo[]> {
        return this.http.get<readonly PersonaRolCatalogo[]>(`${this.apiUrl}/roles`);
    }

    getList(query: PersonaListQuery): Observable<PersonaPagedResponse> {
        let params = new HttpParams()
            .set('pageNumber', query.pageNumber)
            .set('pageSize', query.pageSize);

        const search = query.search?.trim();
        if (search) params = params.set('search', search);
        if (query.idTipoDocumento != null) params = params.set('idTipoDocumento', query.idTipoDocumento);
        if (query.idRolPersona != null) params = params.set('idRolPersona', query.idRolPersona);
        if (query.isActive != null) params = params.set('isActive', query.isActive);

        return this.http.get<PersonaPagedResponse>(this.apiUrl, { params });
    }

    getByDocument(idTipoDocumento: number, numeroDocumento: string): Observable<PersonaLookup | null> {
        const params = new HttpParams().set('idTipoDocumento', idTipoDocumento).set('numeroDocumento', numeroDocumento);
        return this.http.get<PersonaLookup | null>(`${this.apiUrl}/by-document`, { params });
    }

    getById(idPersona: number): Observable<PersonaDetail> {
        return this.http.get<PersonaDetail>(`${this.apiUrl}/${idPersona}`);
    }

    search(search: string, top = 10): Observable<readonly PersonaSearchItem[]> {
        const params = new HttpParams().set('search', search).set('top', top);
        return this.http.get<readonly PersonaSearchItem[]>(`${this.apiUrl}/search`, { params });
    }

    create(request: PersonaCreateRequest): Observable<PersonaCreateResponse> {
        return this.http.post<PersonaCreateResponse>(this.apiUrl, request);
    }

    update(idPersona: number, request: PersonaUpdateRequest): Observable<PersonaUpdateResponse> {
        return this.http.put<PersonaUpdateResponse>(`${this.apiUrl}/${idPersona}`, request);
    }

    changeStatus(idPersona: number, request: PersonaChangeStatusRequest): Observable<PersonaChangeStatusResponse> {
        return this.http.patch<PersonaChangeStatusResponse>(`${this.apiUrl}/${idPersona}/status`, request);
    }

    private get apiUrl(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Persona`; }
}
