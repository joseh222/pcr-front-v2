import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { PersonaCreateRequest, PersonaCreateResponse, PersonaLookup, PersonaSearchItem, PersonaTipoDocumento } from './models/persona-api.models';

@Injectable({ providedIn: 'root' })
export class PersonaApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getTiposDocumento(): Observable<readonly PersonaTipoDocumento[]> {
        return this.http.get<readonly PersonaTipoDocumento[]>(`${this.apiUrl}/tipos-documento`);
    }

    getByDocument(idTipoDocumento: number, numeroDocumento: string): Observable<PersonaLookup | null> {
        const params = new HttpParams().set('idTipoDocumento', idTipoDocumento).set('numeroDocumento', numeroDocumento);
        return this.http.get<PersonaLookup | null>(`${this.apiUrl}/by-document`, { params });
    }

    getById(idPersona: number): Observable<PersonaLookup> {
        return this.http.get<PersonaLookup>(`${this.apiUrl}/${idPersona}`);
    }

    search(search: string, top = 10): Observable<readonly PersonaSearchItem[]> {
        const params = new HttpParams().set('search', search).set('top', top);
        return this.http.get<readonly PersonaSearchItem[]>(`${this.apiUrl}/search`, { params });
    }

    create(request: PersonaCreateRequest): Observable<PersonaCreateResponse> {
        return this.http.post<PersonaCreateResponse>(this.apiUrl, request);
    }

    private get apiUrl(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Persona`; }
}