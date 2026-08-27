import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import {
    UsuarioChangeStatusResponse, UsuarioCreateRequest, UsuarioCreateResponse, UsuarioDetail, UsuarioListQuery,
    UsuarioPagedResponse, UsuarioResetPasswordResponse, UsuarioRevokeSessionResponse, UsuarioRole,
    UsuarioUpdateRequest, UsuarioUpdateResponse
} from './models/usuario-api.models';

@Injectable({ providedIn: 'root' })
export class UsuarioApiService {
    private readonly http = inject(HttpClient);
    private readonly runtimeConfig = inject(RuntimeConfigService);

    getRoles(): Observable<readonly UsuarioRole[]> { return this.http.get<readonly UsuarioRole[]>(`${this.runtimeConfig.config.apiBaseUrl}/Roles`); }

    getList(query: UsuarioListQuery): Observable<UsuarioPagedResponse> {
        let params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
        const search = query.search?.trim();
        if (search) params = params.set('search', search);
        if (query.idRole != null) params = params.set('idRole', query.idRole);
        if (query.isActive != null) params = params.set('isActive', query.isActive);
        return this.http.get<UsuarioPagedResponse>(this.apiUrl, { params });
    }

    getById(idUser: number): Observable<UsuarioDetail> { return this.http.get<UsuarioDetail>(`${this.apiUrl}/${idUser}`); }
    create(request: UsuarioCreateRequest): Observable<UsuarioCreateResponse> { return this.http.post<UsuarioCreateResponse>(this.apiUrl, request); }
    update(idUser: number, request: UsuarioUpdateRequest): Observable<UsuarioUpdateResponse> { return this.http.put<UsuarioUpdateResponse>(`${this.apiUrl}/${idUser}`, request); }
    changeStatus(idUser: number, isActive: boolean, rowVersion: string): Observable<UsuarioChangeStatusResponse> {
        return this.http.patch<UsuarioChangeStatusResponse>(`${this.apiUrl}/${idUser}/status`, { isActive, rowVersion });
    }
    resetPassword(idUser: number): Observable<UsuarioResetPasswordResponse> { return this.http.post<UsuarioResetPasswordResponse>(`${this.apiUrl}/${idUser}/reset-password`, {}); }
    revokeSession(idUser: number): Observable<UsuarioRevokeSessionResponse> { return this.http.post<UsuarioRevokeSessionResponse>(`${this.apiUrl}/${idUser}/revoke-session`, {}); }

    private get apiUrl(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Usuarios`; }
}
