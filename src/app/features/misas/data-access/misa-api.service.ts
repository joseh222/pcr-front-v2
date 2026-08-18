import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import {
    MisaEstado,
    MisaModalidad,
    MisaPrecioCalculo,
    MisaSanto,
    MisaTipo
} from './models/misa-catalog.models';
import {
    MisaDetail,
    MisaListQuery,
    MisaPagedResponse
} from './models/misa-read.models';
import {
    MisaCreateRequest,
    MisaCreateResponse,
    MisaDeleteResponse,
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
            { params: this.buildListParams(query) }
        );
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

    delete(idMisa: number): Observable<MisaDeleteResponse> {
        return this.http.delete<MisaDeleteResponse>(
            `${this.apiUrl}/${idMisa}`
        );
    }

    private buildListParams(query: MisaListQuery): HttpParams {
        let params = new HttpParams()
            .set('pagina', query.pagina)
            .set('tamanoPagina', query.tamanoPagina);

        if (query.fechaInicio) {
            params = params.set('fechaInicio', query.fechaInicio);
        }

        if (query.fechaFin) {
            params = params.set('fechaFin', query.fechaFin);
        }

        if (query.idModalidad != null) {
            params = params.set('idModalidad', query.idModalidad);
        }

        if (query.idTipo != null) {
            params = params.set('idTipo', query.idTipo);
        }

        if (query.idEstado != null) {
            params = params.set('idEstado', query.idEstado);
        }

        if (query.estadoPago?.trim()) {
            params = params.set(
                'estadoPago',
                query.estadoPago.trim()
            );
        }

        if (query.texto?.trim()) {
            params = params.set(
                'texto',
                query.texto.trim()
            );
        }

        return params;
    }

    private get apiUrl(): string {
        return `${this.runtimeConfig.config.apiBaseUrl}/Misa`;
    }
}