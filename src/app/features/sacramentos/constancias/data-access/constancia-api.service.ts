
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import {
    ConfiguracionConstancia,
    ConfiguracionConstanciaUpdateRequest,
    ConfiguracionImpresionConstancia,
    ConfiguracionImpresionConstanciaUpdateRequest,
    ConfiguracionImpresionConstanciaUpdateResponse,
    ConstanciaImpresoraValidacion,
    ConstanciaImpresionTrabajo,
    ConstanciaImpresionTrabajoEstado,
    ConstanciaPlantilla,
    ConstanciaPlantillaEstadoRequest,
    ConstanciaPlantillaUpdateRequest,
    ConstanciaSacramental,
    ConstanciaTipoSacramento
} from './models/constancia.models';

@Injectable({ providedIn: 'root' })
export class ConstanciaApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getConfiguracion(): Observable<ConfiguracionConstancia> { return this.http.get<ConfiguracionConstancia>(`${this.url}/configuracion`); }
    updateConfiguracion(request: ConfiguracionConstanciaUpdateRequest): Observable<ConfiguracionConstancia> { return this.http.put<ConfiguracionConstancia>(`${this.url}/configuracion`, request); }

    getImpresora(): Observable<ConfiguracionImpresionConstancia> { return this.http.get<ConfiguracionImpresionConstancia>(`${this.url}/impresora`); }
    updateImpresora(request: ConfiguracionImpresionConstanciaUpdateRequest): Observable<ConfiguracionImpresionConstanciaUpdateResponse> { return this.http.put<ConfiguracionImpresionConstanciaUpdateResponse>(`${this.url}/impresora`, request); }
    validarImpresora(): Observable<ConstanciaImpresoraValidacion> { return this.http.get<ConstanciaImpresoraValidacion>(`${this.url}/impresora/validar`); }

    getPlantilla(tipo: ConstanciaTipoSacramento): Observable<ConstanciaPlantilla> { return this.http.get<ConstanciaPlantilla>(`${this.url}/plantillas/${tipo}`); }
    updatePlantilla(tipo: ConstanciaTipoSacramento, request: ConstanciaPlantillaUpdateRequest): Observable<ConstanciaPlantilla> { return this.http.put<ConstanciaPlantilla>(`${this.url}/plantillas/${tipo}`, request); }
    abrirCalibracion(tipo: ConstanciaTipoSacramento, request: ConstanciaPlantillaEstadoRequest): Observable<ConstanciaPlantilla> { return this.http.post<ConstanciaPlantilla>(`${this.url}/plantillas/${tipo}/calibracion/abrir`, request); }
    marcarCalibrada(tipo: ConstanciaTipoSacramento, request: ConstanciaPlantillaEstadoRequest): Observable<ConstanciaPlantilla> { return this.http.post<ConstanciaPlantilla>(`${this.url}/plantillas/${tipo}/calibracion/marcar`, request); }
    getPruebaPdf(tipo: ConstanciaTipoSacramento): Observable<Blob> { return this.http.post(`${this.url}/plantillas/${tipo}/prueba`, null, { responseType: 'blob' }); }
    imprimirPrueba(tipo: ConstanciaTipoSacramento): Observable<ConstanciaImpresionTrabajo> { return this.http.post<ConstanciaImpresionTrabajo>(`${this.url}/plantillas/${tipo}/prueba/imprimir`, null); }

    getBySolicitud(idSolicitudServicio: number): Observable<ConstanciaSacramental | null> { return this.http.get<ConstanciaSacramental | null>(`${this.url}/solicitudes/${idSolicitudServicio}`); }
    imprimir(idSolicitudServicio: number, cantidad: number): Observable<ConstanciaImpresionTrabajo> { return this.http.post<ConstanciaImpresionTrabajo>(`${this.url}/solicitudes/${idSolicitudServicio}/imprimir`, { cantidad }); }
    getTrabajoEstado(idTrabajo: number): Observable<ConstanciaImpresionTrabajoEstado> { return this.http.get<ConstanciaImpresionTrabajoEstado>(`${this.url}/trabajos/${idTrabajo}`); }

    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Constancia`; }
}
