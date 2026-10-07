import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { LicenciaActivarResponse, LicenciaHistorial, LicenciamientoEstado, SolicitudLicenciaDocument } from './models/licenciamiento.models';

@Injectable({ providedIn: 'root' })
export class LicenciamientoApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getStatus(): Observable<LicenciamientoEstado> {
        return this.http.get<LicenciamientoEstado>(`${this.url}/status`);
    }

    getRequest(): Observable<SolicitudLicenciaDocument> {
        return this.http.get<SolicitudLicenciaDocument>(`${this.url}/request`);
    }

    getHistory(): Observable<readonly LicenciaHistorial[]> {
        return this.http.get<readonly LicenciaHistorial[]>(`${this.url}/history`);
    }

    activate(contenidoLicencia: string): Observable<LicenciaActivarResponse> {
        return this.http.post<LicenciaActivarResponse>(`${this.url}/activate`, { contenidoLicencia });
    }

    private get url(): string {
        return `${this.runtimeConfig.config.apiBaseUrl}/Licensing`;
    }
}
