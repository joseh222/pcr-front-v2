import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ReporteVentasFilters, ReporteVentasResponse } from './reporte-ventas.models';

@Injectable({ providedIn: 'root' })
export class ReporteVentasApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    get(filters: ReporteVentasFilters): Observable<ReporteVentasResponse> { return this.http.get<ReporteVentasResponse>(this.url, { params: this.buildParams(filters) }); }
    exportExcel(filters: ReporteVentasFilters): Observable<Blob> { return this.http.get(`${this.url}/excel`, { params: this.buildParams(filters), responseType: 'blob' }); }
    exportPdf(filters: ReporteVentasFilters): Observable<Blob> { return this.http.get(`${this.url}/pdf`, { params: this.buildParams(filters), responseType: 'blob' }); }

    private buildParams(filters: ReporteVentasFilters): HttpParams {
        let params = new HttpParams().set('fechaInicio', filters.fechaInicio).set('fechaFin', filters.fechaFin);
        if (filters.tipoItem) params = params.set('tipoItem', filters.tipoItem);
        return params;
    }

    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/reportes/ventas`; }
}
