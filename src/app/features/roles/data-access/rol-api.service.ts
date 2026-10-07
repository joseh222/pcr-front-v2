import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { PermisoItem, RolChangeStatusResponse, RolCreateRequest, RolCreateResponse, RolDetail, RolListItem, RolPermisoItem, RolPermissionsUpdateResponse, RolUpdateRequest, RolUpdateResponse } from './models/rol-api.models';

@Injectable({ providedIn: 'root' })
export class RolApiService {
    private readonly http = inject(HttpClient); private readonly runtimeConfig = inject(RuntimeConfigService);
    getRoles(onlyActive = true): Observable<readonly RolListItem[]> { return this.http.get<readonly RolListItem[]>(this.apiUrl, { params: new HttpParams().set('onlyActive', onlyActive) }); }
    getPermissions(): Observable<readonly PermisoItem[]> { return this.http.get<readonly PermisoItem[]>(`${this.apiUrl}/permissions`); }
    getById(idRole: number): Observable<RolDetail> { return this.http.get<RolDetail>(`${this.apiUrl}/${idRole}`); }
    getRolePermissions(idRole: number): Observable<readonly RolPermisoItem[]> { return this.http.get<readonly RolPermisoItem[]>(`${this.apiUrl}/${idRole}/permissions`); }
    create(request: RolCreateRequest): Observable<RolCreateResponse> { return this.http.post<RolCreateResponse>(this.apiUrl, request); }
    update(idRole: number, request: RolUpdateRequest): Observable<RolUpdateResponse> { return this.http.put<RolUpdateResponse>(`${this.apiUrl}/${idRole}`, request); }
    changeStatus(idRole: number, isActive: boolean, rowVersion: string): Observable<RolChangeStatusResponse> { return this.http.patch<RolChangeStatusResponse>(`${this.apiUrl}/${idRole}/status`, { isActive, rowVersion }); }
    updatePermissions(idRole: number, permisos: readonly number[], rowVersion: string): Observable<RolPermissionsUpdateResponse> { return this.http.put<RolPermissionsUpdateResponse>(`${this.apiUrl}/${idRole}/permissions`, { permisos, rowVersion }); }
    private get apiUrl(): string { return `${this.runtimeConfig.config.apiBaseUrl}/Roles`; }
}
