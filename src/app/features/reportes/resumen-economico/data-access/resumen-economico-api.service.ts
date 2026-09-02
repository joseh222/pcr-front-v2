import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ResumenEconomicoFilters, ResumenEconomicoResponse } from './resumen-economico.models';

@Injectable({ providedIn: 'root' })
export class ResumenEconomicoApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    get(filters: ResumenEconomicoFilters): Observable<ResumenEconomicoResponse> { return this.http.get<ResumenEconomicoResponse>(this.url, { params: this.buildParams(filters) }); }
    exportExcel(filters: ResumenEconomicoFilters): Observable<Blob> { return this.http.get(`${this.url}/excel`, { params: this.buildParams(filters), responseType: 'blob' }); }
    exportPdf(filters: ResumenEconomicoFilters): Observable<Blob> { return this.http.get(`${this.url}/pdf`, { params: this.buildParams(filters), responseType: 'blob' }); }

    private buildParams(filters: ResumenEconomicoFilters): HttpParams { return new HttpParams().set('fechaInicio', filters.fechaInicio).set('fechaFin', filters.fechaFin); }
    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/reportes/resumen-economico`; }
}
