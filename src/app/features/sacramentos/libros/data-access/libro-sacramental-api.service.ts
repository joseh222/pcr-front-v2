import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { EstadoDigitalizacionCatalogItem, EstadoFisicoCatalogItem, FolioSacramental, LibroSacramentalCreateRequest, LibroSacramentalCreateResponse, LibroSacramentalDetail, LibroSacramentalDigitizationStatusResponse, LibroSacramentalFilters, LibroSacramentalListItem, LibroSacramentalPhysicalStatusResponse, LibroSacramentalUpdateRequest, LibroSacramentalUpdateResponse, SacramentoCatalogItem } from './models/libro-sacramental.models';

@Injectable({ providedIn: 'root' })
export class LibroSacramentalApiService {
    private readonly http = inject(HttpClient); private readonly runtimeConfig = inject(RuntimeConfigService);
    getTiposSacramento(): Observable<readonly SacramentoCatalogItem[]> { return this.http.get<readonly SacramentoCatalogItem[]>(`${this.url}/tipos-sacramento`); }
    getEstadosFisicos(): Observable<readonly EstadoFisicoCatalogItem[]> { return this.http.get<readonly EstadoFisicoCatalogItem[]>(`${this.url}/estados-fisicos`); }
    getEstadosDigitalizacion(): Observable<readonly EstadoDigitalizacionCatalogItem[]> { return this.http.get<readonly EstadoDigitalizacionCatalogItem[]>(`${this.url}/estados-digitalizacion`); }
    getList(filters: LibroSacramentalFilters = {}): Observable<readonly LibroSacramentalListItem[]> { return this.http.get<readonly LibroSacramentalListItem[]>(this.url, { params: this.buildParams(filters) }); }
    getById(id: number): Observable<LibroSacramentalDetail> { return this.http.get<LibroSacramentalDetail>(`${this.url}/${id}`); }
    getFolios(id: number, numeroFolio?: string | null): Observable<readonly FolioSacramental[]> { let params = new HttpParams(); if (numeroFolio?.trim()) params = params.set('numeroFolio', numeroFolio.trim()); return this.http.get<readonly FolioSacramental[]>(`${this.url}/${id}/folios`, { params }); }
    create(request: LibroSacramentalCreateRequest): Observable<LibroSacramentalCreateResponse> { return this.http.post<LibroSacramentalCreateResponse>(this.url, request); }
    update(id: number, request: LibroSacramentalUpdateRequest): Observable<LibroSacramentalUpdateResponse> { return this.http.put<LibroSacramentalUpdateResponse>(`${this.url}/${id}`, request); }
    changePhysicalStatus(id: number, codigoEstadoDestino: string): Observable<LibroSacramentalPhysicalStatusResponse> { return this.http.patch<LibroSacramentalPhysicalStatusResponse>(`${this.url}/${id}/estado-fisico`, { codigoEstadoDestino }); }
    changeDigitizationStatus(id: number, codigoEstadoDestino: string): Observable<LibroSacramentalDigitizationStatusResponse> { return this.http.patch<LibroSacramentalDigitizationStatusResponse>(`${this.url}/${id}/digitalizacion`, { codigoEstadoDestino }); }
    reopenDigitization(id: number): Observable<LibroSacramentalDigitizationStatusResponse> { return this.http.post<LibroSacramentalDigitizationStatusResponse>(`${this.url}/${id}/digitalizacion/reabrir`, { confirmarReapertura: true }); }
    private buildParams(filters: LibroSacramentalFilters): HttpParams { let params = new HttpParams().set('soloActivos', filters.soloActivos ?? true); if (filters.idTipoSacramento != null) params = params.set('idTipoSacramento', filters.idTipoSacramento); if (filters.codigoEstadoFisico?.trim()) params = params.set('codigoEstadoFisico', filters.codigoEstadoFisico.trim()); if (filters.codigoEstadoDigitalizacion?.trim()) params = params.set('codigoEstadoDigitalizacion', filters.codigoEstadoDigitalizacion.trim()); if (filters.numeroLibro?.trim()) params = params.set('numeroLibro', filters.numeroLibro.trim()); return params; }
    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/LibroSacramental`; }
}
