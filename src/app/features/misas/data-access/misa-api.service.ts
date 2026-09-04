import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { PersonaLookup, PersonaSearchItem, PersonaTipoDocumento } from '../../personas/data-access/models/persona-api.models';
import {
    MisaEstado,
    MisaModalidad,
    MisaPrecioCalculo,
    MisaSanto,
    MisaTipo
} from './models/misa-catalog.models';
import { MisaCalendarResponse } from './models/misa-calendar.models';
import {
    MisaDetail,
    MisaListFilters,
    MisaListQuery,
    MisaPagedResponse
} from './models/misa-read.models';
import {
    MisaCreateRequest,
    MisaCreateResponse,
    MisaDeleteResponse,
    MisaIntencionCorreccionRequest,
    MisaIntencionCorreccionResponse,
    MisaUpdateRequest,
    MisaUpdateResponse
} from './models/misa-write.models';

@Injectable({
    providedIn: 'root'
})
export class MisaApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getList(query: MisaListQuery): Observable<MisaPagedResponse> {
        return this.http.get<MisaPagedResponse>(
            this.apiUrl,
            { params: this.buildFilterParams(query).set('pagina', query.pagina).set('tamanoPagina', query.tamanoPagina) }
        );
    }

    exportExcel(filters: MisaListFilters): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/exportar/excel`, { params: this.buildFilterParams(filters), responseType: 'blob' });
    }

    exportPdf(filters: MisaListFilters): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/exportar/pdf`, { params: this.buildFilterParams(filters), responseType: 'blob' });
    }


    getCalendar(fechaInicio: string, fechaFin: string): Observable<MisaCalendarResponse> {
        const params = new HttpParams().set('fechaInicio', fechaInicio).set('fechaFin', fechaFin);
        return this.http.get<MisaCalendarResponse>(`${this.apiUrl}/calendario`, { params });
    }

    getById(idMisa: number): Observable<MisaDetail> {
        return this.http.get<MisaDetail>(
            `${this.apiUrl}/${idMisa}`
        );
    }

    getModalidades(): Observable<readonly MisaModalidad[]> {
        return this.http.get<readonly MisaModalidad[]>(
            `${this.apiUrl}/modalidades`
        );
    }

    getTipos(): Observable<readonly MisaTipo[]> {
        return this.http.get<readonly MisaTipo[]>(
            `${this.apiUrl}/tipos`
        );
    }

    getSantos(): Observable<readonly MisaSanto[]> {
        return this.http.get<readonly MisaSanto[]>(
            `${this.apiUrl}/santos`
        );
    }

    getEstados(): Observable<readonly MisaEstado[]> {
        return this.http.get<readonly MisaEstado[]>(
            `${this.apiUrl}/estados`
        );
    }

    getPrecioCalculo(
        idTipo: number,
        idModalidad: number
    ): Observable<MisaPrecioCalculo> {
        const params = new HttpParams()
            .set('idTipo', idTipo)
            .set('idModalidad', idModalidad);

        return this.http.get<MisaPrecioCalculo>(
            `${this.apiUrl}/precio-calculo`,
            { params }
        );
    }

    getPersonaTiposDocumento(): Observable<readonly PersonaTipoDocumento[]> { return this.http.get<readonly PersonaTipoDocumento[]>(`${this.apiUrl}/personas/tipos-documento`); }

    getPersonaByDocument(idTipoDocumento: number, numeroDocumento: string): Observable<PersonaLookup | null> {
        const params = new HttpParams().set('idTipoDocumento', idTipoDocumento).set('numeroDocumento', numeroDocumento);
        return this.http.get<PersonaLookup | null>(`${this.apiUrl}/personas/by-document`, { params });
    }

    searchPersonas(search: string, top = 10): Observable<readonly PersonaSearchItem[]> {
        const params = new HttpParams().set('search', search).set('top', top);
        return this.http.get<readonly PersonaSearchItem[]>(`${this.apiUrl}/personas/search`, { params });
    }

    create(request: MisaCreateRequest): Observable<MisaCreateResponse> {
        return this.http.post<MisaCreateResponse>(
            this.apiUrl,
            request
        );
    }

    update(
        idMisa: number,
        request: MisaUpdateRequest
    ): Observable<MisaUpdateResponse> {
        return this.http.put<MisaUpdateResponse>(
            `${this.apiUrl}/${idMisa}`,
            request
        );
    }

    correctIntenciones(idMisa: number, request: MisaIntencionCorreccionRequest): Observable<MisaIntencionCorreccionResponse> {
        return this.http.patch<MisaIntencionCorreccionResponse>(`${this.apiUrl}/${idMisa}/intenciones`, request);
    }

    delete(idMisa: number): Observable<MisaDeleteResponse> {
        return this.http.delete<MisaDeleteResponse>(
            `${this.apiUrl}/${idMisa}`
        );
    }

    private buildFilterParams(filters: MisaListFilters): HttpParams {
        let params = new HttpParams();

        if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio);
        if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin);
        if (filters.idModalidad != null) params = params.set('idModalidad', filters.idModalidad);
        if (filters.idTipo != null) params = params.set('idTipo', filters.idTipo);
        if (filters.idEstado != null) params = params.set('idEstado', filters.idEstado);
        if (filters.estadoPago?.trim()) params = params.set('estadoPago', filters.estadoPago.trim());
        if (filters.texto?.trim()) params = params.set('texto', filters.texto.trim());

        return params;
    }

    private get apiUrl(): string {
        return `${this.runtimeConfig.config.apiBaseUrl}/Misa`;
    }
}