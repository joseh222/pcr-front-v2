import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ConfiguracionImpresion, ConfiguracionImpresionUpdateRequest } from './models/configuracion-impresion.models';
import { ConfiguracionSacramental, ConfiguracionSacramentalUpdateRequest } from './models/configuracion-sacramental.models';

@Injectable({ providedIn: 'root' })
export class ConfiguracionApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);
    getImpresion(): Observable<ConfiguracionImpresion> { return this.http.get<ConfiguracionImpresion>(`${this.url}/configuracion/impresion`); }
    updateImpresion(request: ConfiguracionImpresionUpdateRequest): Observable<ConfiguracionImpresion> { return this.http.put<ConfiguracionImpresion>(`${this.url}/configuracion/impresion`, request); }
    getSacramental(): Observable<ConfiguracionSacramental> { return this.http.get<ConfiguracionSacramental>(`${this.url}/configuracion/sacramental`); }
    updateSacramental(request: ConfiguracionSacramentalUpdateRequest): Observable<ConfiguracionSacramental> { return this.http.put<ConfiguracionSacramental>(`${this.url}/configuracion/sacramental`, request); }
    private get url(): string { return `${this.runtimeConfig.config.apiBaseUrl}/General`; }
}
