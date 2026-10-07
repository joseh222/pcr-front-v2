import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ReporteComprasFilters, ReporteComprasResponse } from './reporte-compras.models';

@Injectable({ providedIn: 'root' })
export class ReporteComprasApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    get(filters: ReporteComprasFilters): Observable<ReporteComprasResponse> { return this.http.get<ReporteComprasResponse>(this.url, { params: this.buildParams(filters) }); }
    exportExcel(filters: ReporteComprasFilters): Observable<Blob> { return this.http.get(`${this.url}/excel`, { params: this.buildParams(filters), responseType: 'blob' }); }
    exportPdf(filters: ReporteComprasFilters): Observable<Blob> { return this.http.get(`${this.url}/pdf`, { params: this.buildParams(filters), responseType: 'blob' }); }

    private buildParams(filters: ReporteComprasFilters): HttpParams { return new HttpParams().set('fechaInicio', filters.fechaInicio).set('fechaFin', filters.fechaFin); }
    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/reportes/compras`; }
}
