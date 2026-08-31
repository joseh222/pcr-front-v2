import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { VentaMetodoPago, VentaTipoComprobante } from './models/venta-catalog.models';
import { VentaProductoBusqueda, VentaSolicitudDetalle, VentaSolicitudPendiente } from './models/venta-lookup.models';
import { VentaCreateRequest, VentaCreateResponse } from './models/venta-write.models';
import { VentaDetailResponse, VentaListQuery, VentaPagedResponse } from './models/venta-read.models';
import { VentaCancelRequest, VentaCancelResponse, VentaRazonAnulacion } from './models/venta-cancel.models';
import { DocumentoImpresionEjecucionResponse, DocumentoImpresionResponse, VentaDocumentoTipo, VentaDocumentosResponse, VentaImpresionModoResponse } from './models/venta-document.models';
import { PersonaCreateRequest, PersonaCreateResponse, PersonaLookup, PersonaSearchItem, PersonaTipoDocumento } from '../../personas/data-access/models/persona-api.models';

@Injectable({ providedIn: 'root' })
export class VentaApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getMetodosPago(): Observable<readonly VentaMetodoPago[]> {
        return this.http.get<readonly VentaMetodoPago[]>(`${this.ventaUrl}/metodos-pago`);
    }

    getTiposComprobante(): Observable<readonly VentaTipoComprobante[]> {
        return this.http.get<readonly VentaTipoComprobante[]>(`${this.ventaUrl}/tipos-comprobante`);
    }

    getRazonesAnulacion(): Observable<readonly VentaRazonAnulacion[]> {
        return this.http.get<readonly VentaRazonAnulacion[]>(`${this.ventaUrl}/razones-anulacion`);
    }

    searchServiciosPendientes(search: string, top = 20): Observable<readonly VentaSolicitudPendiente[]> {
        const params = new HttpParams().set('search', search).set('top', top);
        return this.http.get<readonly VentaSolicitudPendiente[]>(`${this.ventaUrl}/solicitudes/pendientes`, { params });
    }

    getSolicitudById(idSolicitudServicio: number): Observable<VentaSolicitudDetalle> {
        return this.http.get<VentaSolicitudDetalle>(`${this.ventaUrl}/solicitudes/${idSolicitudServicio}`);
    }

    searchProductos(search: string, top = 10): Observable<readonly VentaProductoBusqueda[]> {
        const params = new HttpParams().set('search', search).set('top', top);
        return this.http.get<readonly VentaProductoBusqueda[]>(`${this.ventaUrl}/productos/search`, { params });
    }


    getPersonaTiposDocumento(): Observable<readonly PersonaTipoDocumento[]> { return this.http.get<readonly PersonaTipoDocumento[]>(`${this.ventaUrl}/personas/tipos-documento`); }
    getPersonaByDocument(idTipoDocumento: number, numeroDocumento: string): Observable<PersonaLookup | null> {
        const params = new HttpParams().set('idTipoDocumento', idTipoDocumento).set('numeroDocumento', numeroDocumento);
        return this.http.get<PersonaLookup | null>(`${this.ventaUrl}/personas/by-document`, { params });
    }
    searchPersonas(search: string, top = 10): Observable<readonly PersonaSearchItem[]> {
        const params = new HttpParams().set('search', search).set('top', top);
        return this.http.get<readonly PersonaSearchItem[]>(`${this.ventaUrl}/personas/search`, { params });
    }
    getPersonaById(idPersona: number): Observable<PersonaLookup> { return this.http.get<PersonaLookup>(`${this.ventaUrl}/personas/${idPersona}`); }
    
    createPersona(request: PersonaCreateRequest): Observable<PersonaCreateResponse> { return this.http.post<PersonaCreateResponse>(`${this.ventaUrl}/personas`, request); }
    
    create(request: VentaCreateRequest): Observable<VentaCreateResponse> {
        return this.http.post<VentaCreateResponse>(this.ventaUrl, request);
    }

    getById(idVenta: number): Observable<VentaDetailResponse> {
        return this.http.get<VentaDetailResponse>(`${this.ventaUrl}/${idVenta}`);
    }

    getTicket(idVenta: number): Observable<Blob> { return this.http.get(`${this.ventaUrl}/${idVenta}/ticket`, { responseType: 'blob' }); }
    getDocuments(idVenta: number): Observable<VentaDocumentosResponse> { return this.http.get<VentaDocumentosResponse>(`${this.ventaUrl}/${idVenta}/documentos`); }
    getDocumentsPdf(idVenta: number): Observable<Blob> { return this.http.get(`${this.ventaUrl}/${idVenta}/documentos/pdf`, { responseType: 'blob' }); }
    getMisasTicket(idVenta: number): Observable<Blob> { return this.http.get(`${this.ventaUrl}/${idVenta}/documentos/misas`, { responseType: 'blob' }); }
    requestPrint(idVenta: number, tipoDocumento: VentaDocumentoTipo): Observable<DocumentoImpresionResponse> { return this.http.post<DocumentoImpresionResponse>(`${this.ventaUrl}/${idVenta}/documentos/${tipoDocumento}/solicitudes-impresion`, null); }
    getPrintMode(): Observable<VentaImpresionModoResponse> { return this.http.get<VentaImpresionModoResponse>(`${this.ventaUrl}/impresion/configuracion`); }
    printDocument(idVenta: number, tipoDocumento: VentaDocumentoTipo): Observable<DocumentoImpresionEjecucionResponse> { return this.http.post<DocumentoImpresionEjecucionResponse>(`${this.ventaUrl}/${idVenta}/documentos/${tipoDocumento}/imprimir`, null); }

    cancel(idVenta: number, request: VentaCancelRequest): Observable<VentaCancelResponse> {
        return this.http.patch<VentaCancelResponse>(`${this.ventaUrl}/${idVenta}/anular`, request);
    }

    getList(query: VentaListQuery): Observable<VentaPagedResponse> {
        return this.http.get<VentaPagedResponse>(this.ventaUrl,
            {
                params: this.buildListParams(query)
            }
        );
    }

    private buildListParams(query: VentaListQuery): HttpParams {
        let params = new HttpParams()
            .set('pagina', query.pagina)
            .set('tamanoPagina', query.tamanoPagina);

        if (query.fechaInicio) {
            params = params.set('fechaInicio', query.fechaInicio);
        }

        if (query.fechaFin) {
            params = params.set('fechaFin', query.fechaFin);
        }

        if (
            query.idMetodoPago != null) {
            params = params.set('idMetodoPago', query.idMetodoPago);
        }

        if (query.idTipoComprobante != null) {
            params = params.set('idTipoComprobante', query.idTipoComprobante);
        }

        if (query.tipoItem) {
            params = params.set('tipoItem', query.tipoItem);
        }

        if (query.texto?.trim()) {
            params = params.set('texto', query.texto.trim());
        }

        return params;
    }

    private get ventaUrl(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Venta`; }
}
