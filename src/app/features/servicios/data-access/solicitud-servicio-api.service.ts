import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { PersonaCreateRequest, PersonaCreateResponse, PersonaLookup, PersonaSearchItem, PersonaTipoDocumento } from '../../personas/data-access/models/persona-api.models';
import { ServicioDetail, ServicioLookupItem, ServicioPagedResponse } from './models/servicio-lookup.models';
import { EstadoPagoSolicitudServicio, EstadoSolicitudServicio } from './models/solicitud-servicio-catalog.models';
import { SolicitudServicioDetailResponse, SolicitudServicioListQuery, SolicitudServicioPagedResponse } from './models/solicitud-servicio-read.models';
import { SolicitudServicioAnularRequest, SolicitudServicioAnularResponse, SolicitudServicioCreateRequest, SolicitudServicioCreateResponse, SolicitudServicioUpdateRequest, SolicitudServicioUpdateResponse } from './models/solicitud-servicio-write.models';

@Injectable({ providedIn: 'root' })
export class SolicitudServicioApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getEstados(): Observable<readonly EstadoSolicitudServicio[]> {
        return this.http.get<readonly EstadoSolicitudServicio[]>(`${this.apiUrl}/estados`);
    }

    getEstadosPago(): Observable<readonly EstadoPagoSolicitudServicio[]> {
        return this.http.get<readonly EstadoPagoSolicitudServicio[]>(`${this.apiUrl}/estados-pago`);
    }

    getList(query: SolicitudServicioListQuery): Observable<SolicitudServicioPagedResponse> {
        let params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
        if (query.search) params = params.set('search', query.search);
        if (query.idServicio !== null) params = params.set('idServicio', query.idServicio);
        if (query.estadoSolicitud) params = params.set('estadoSolicitud', query.estadoSolicitud);
        if (query.estadoPago) params = params.set('estadoPago', query.estadoPago);
        if (query.requierePago !== null) params = params.set('requierePago', query.requierePago);
        if (query.fechaInicio) params = params.set('fechaInicio', query.fechaInicio);
        if (query.fechaFin) params = params.set('fechaFin', query.fechaFin);
        return this.http.get<SolicitudServicioPagedResponse>(this.apiUrl, { params });
    }

    getById(idSolicitudServicio: number): Observable<SolicitudServicioDetailResponse> {
        return this.http.get<SolicitudServicioDetailResponse>(`${this.apiUrl}/${idSolicitudServicio}`);
    }

    getServicios(): Observable<ServicioPagedResponse> { const params = new HttpParams().set('pageNumber', 1).set('pageSize', 100).set('isActive', true); return this.http.get<ServicioPagedResponse>(`${this.apiUrl}/servicios`, { params }); }

    searchServicios(search: string, top = 10): Observable<readonly ServicioLookupItem[]> { const params = new HttpParams().set('search', search).set('top', top); return this.http.get<readonly ServicioLookupItem[]>(`${this.apiUrl}/servicios/search`, { params }); }

    getServicioById(idServicio: number): Observable<ServicioDetail> { return this.http.get<ServicioDetail>(`${this.apiUrl}/servicios/${idServicio}`); }

    getPersonaTiposDocumento(): Observable<readonly PersonaTipoDocumento[]> { return this.http.get<readonly PersonaTipoDocumento[]>(`${this.apiUrl}/personas/tipos-documento`); }

    searchPersonas(search: string, top = 10): Observable<readonly PersonaSearchItem[]> { const params = new HttpParams().set('search', search).set('top', top); return this.http.get<readonly PersonaSearchItem[]>(`${this.apiUrl}/personas/search`, { params }); }

    getPersonaByDocument(idTipoDocumento: number, numeroDocumento: string): Observable<PersonaLookup | null> { const params = new HttpParams().set('idTipoDocumento', idTipoDocumento).set('numeroDocumento', numeroDocumento); return this.http.get<PersonaLookup | null>(`${this.apiUrl}/personas/by-document`, { params }); }

    createPersona(request: PersonaCreateRequest): Observable<PersonaCreateResponse> { return this.http.post<PersonaCreateResponse>(`${this.apiUrl}/personas`, request); }
    
    create(request: SolicitudServicioCreateRequest): Observable<SolicitudServicioCreateResponse> {
        return this.http.post<SolicitudServicioCreateResponse>(this.apiUrl, request);
    }

    update(idSolicitudServicio: number, request: SolicitudServicioUpdateRequest): Observable<SolicitudServicioUpdateResponse> {
        return this.http.put<SolicitudServicioUpdateResponse>(`${this.apiUrl}/${idSolicitudServicio}`, request);
    }

    cancel(idSolicitudServicio: number, request: SolicitudServicioAnularRequest): Observable<SolicitudServicioAnularResponse> {
        return this.http.patch<SolicitudServicioAnularResponse>(`${this.apiUrl}/${idSolicitudServicio}/anular`, request);
    }

    private get apiUrl(): string { return `${this.runtimeConfig.config.apiBaseUrl}/SolicitudServicio`; }
}
