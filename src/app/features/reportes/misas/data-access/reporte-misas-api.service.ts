import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ReporteMisasFilters, ReporteMisasResponse } from './reporte-misas.models';

@Injectable({ providedIn: 'root' })
export class ReporteMisasApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    get(filters: ReporteMisasFilters): Observable<ReporteMisasResponse> { return this.http.get<ReporteMisasResponse>(this.url, { params: this.buildParams(filters) }); }
    exportExcel(filters: ReporteMisasFilters): Observable<Blob> { return this.http.get(`${this.url}/excel`, { params: this.buildParams(filters), responseType: 'blob' }); }
    exportPdf(filters: ReporteMisasFilters): Observable<Blob> { return this.http.get(`${this.url}/pdf`, { params: this.buildParams(filters), responseType: 'blob' }); }

    private buildParams(filters: ReporteMisasFilters): HttpParams {
        let params = new HttpParams().set('fechaInicio', filters.fechaInicio).set('fechaFin', filters.fechaFin);
        if (filters.idModalidad != null) params = params.set('idModalidad', filters.idModalidad);
        if (filters.idTipo != null) params = params.set('idTipo', filters.idTipo);
        if (filters.idEstado != null) params = params.set('idEstado', filters.idEstado);
        if (filters.estadoPago) params = params.set('estadoPago', filters.estadoPago);
        return params;
    }

    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/reportes/misas`; }
}
