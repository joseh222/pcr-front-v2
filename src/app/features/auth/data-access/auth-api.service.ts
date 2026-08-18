import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import {
    AuthenticationResponse,
    LoginRequest,
    LogoutResponse,
    RefreshSessionRequest
} from './auth-api.models';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    login(request: LoginRequest): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.apiUrl}/Login`, request);
    }

    refreshSession(request: RefreshSessionRequest): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.apiUrl}/RefreshSession`, request);
    }

    logout(): Observable<LogoutResponse> {
        return this.http.post<LogoutResponse>(`${this.apiUrl}/Logout`, {});
    }

    private get apiUrl(): string {
        return `${this.runtimeConfig.config.apiBaseUrl}/Seguridad`;
    }
}