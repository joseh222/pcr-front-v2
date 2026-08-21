import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
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
