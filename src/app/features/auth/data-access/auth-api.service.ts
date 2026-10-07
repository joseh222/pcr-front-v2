import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SKIP_AUTH } from '../../../core/auth/auth-http-context';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { AuthenticationResponse, CurrentAccessResponse, LoginRequest, LogoutResponse, RefreshSessionRequest } from './auth-api.models';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    login(request: LoginRequest): Observable<AuthenticationResponse> {
        const context = new HttpContext().set(SKIP_AUTH, true);
        return this.http.post<AuthenticationResponse>(`${this.apiUrl}/Login`, request, { context });
    }

    refreshSession(request: RefreshSessionRequest): Observable<AuthenticationResponse> {
        const context = new HttpContext().set(SKIP_AUTH, true);
        return this.http.post<AuthenticationResponse>(`${this.apiUrl}/RefreshSession`, request, { context });
    }

    access(): Observable<CurrentAccessResponse> {
        return this.http.get<CurrentAccessResponse>(`${this.apiUrl}/Access`);
    }

    logout(): Observable<LogoutResponse> {
        return this.http.post<LogoutResponse>(`${this.apiUrl}/Logout`, {});
    }

    private get apiUrl(): string {
        return `${this.runtimeConfig.config.apiBaseUrl}/Seguridad`;
    }
}