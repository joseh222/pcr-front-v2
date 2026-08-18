import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ChangePasswordRequest, ChangePasswordResponse } from './account-api.models';

@Injectable({
    providedIn: 'root'
})
export class AccountApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    changePassword(request: ChangePasswordRequest): Observable<ChangePasswordResponse> {
        return this.http.post<ChangePasswordResponse>(`${this.apiUrl}/change-password`, request);
    }

    private get apiUrl(): string {
        return `${this.runtimeConfig.config.apiBaseUrl}/Cuenta`;
    }
}