import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { RolApiService } from '../rol-api.service';
import { PermisoItem, RolCreateRequest, RolDetail, RolUpdateResponse } from './rol-api.models';

export interface RolFormSaveResult { readonly idRole: number; readonly mensaje: string; }
interface RolFormLoadResult { readonly detail: RolDetail | null; readonly permissions: readonly PermisoItem[]; readonly assignedIds: readonly number[]; }

@Injectable()
export class RolFormStore {
    private readonly api = inject(RolApiService); private readonly loadingSignal = signal(false); private readonly loadErrorSignal = signal<string | null>(null); private readonly savingSignal = signal(false); private readonly saveErrorSignal = signal<string | null>(null); private readonly saveResultSignal = signal<RolFormSaveResult | null>(null); private readonly detailSignal = signal<RolDetail | null>(null); private readonly permissionsSignal = signal<readonly PermisoItem[]>([]); private readonly assignedIdsSignal = signal<readonly number[]>([]);
    readonly loading = this.loadingSignal.asReadonly(); readonly loadError = this.loadErrorSignal.asReadonly(); readonly saving = this.savingSignal.asReadonly(); readonly saveError = this.saveErrorSignal.asReadonly(); readonly saveResult = this.saveResultSignal.asReadonly(); readonly detail = this.detailSignal.asReadonly(); readonly permissions = this.permissionsSignal.asReadonly(); readonly assignedPermissionIds = this.assignedIdsSignal.asReadonly();

    initialize(idRole: number | null): void {
        this.loadingSignal.set(true); this.loadErrorSignal.set(null); this.detailSignal.set(null); this.permissionsSignal.set([]); this.assignedIdsSignal.set([]);
        const request: Observable<RolFormLoadResult> = idRole === null ? this.api.getPermissions().pipe(map(permissions => ({ detail: null, permissions, assignedIds: [] }))) : forkJoin({ detail: this.api.getById(idRole), permissions: this.api.getRolePermissions(idRole) }).pipe(map(({ detail, permissions }) => ({ detail, permissions, assignedIds: detail.grantsAllPermissions ? permissions.map(permission => permission.idPermiso) : permissions.filter(permission => permission.isAssigned).map(permission => permission.idPermiso) })));
        request.subscribe({ next: result => { this.detailSignal.set(result.detail); this.permissionsSignal.set(result.permissions); this.assignedIdsSignal.set(result.assignedIds); this.loadingSignal.set(false); }, error: error => { this.loadingSignal.set(false); this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar el rol y sus permisos.')); } });
    }

    create(request: RolCreateRequest, permissionIds: readonly number[]): void {
        if (this.savingSignal()) return; this.beginSave(); let createdId: number | null = null;
        this.api.create(request).pipe(tap(result => { createdId = result.idRole; }), switchMap(result => this.api.updatePermissions(result.idRole, [...new Set(permissionIds)], result.rowVersion).pipe(map(() => ({ idRole: result.idRole, mensaje: 'Rol creado y permisos guardados correctamente.' }))))).subscribe({ next: result => this.finishSave(result), error: error => { const prefix = createdId === null ? '' : 'El rol fue creado, pero no se pudieron guardar sus permisos. '; this.failSave(error, `${prefix}Revisa el rol desde el listado y vuelve a guardar sus permisos.`); } });
    }

    update(idRole: number, name: string, description: string | null, permissionIds: readonly number[]): void {
        const detail = this.detailSignal(); if (!detail || this.savingSignal()) return; this.beginSave(); const permissions = [...new Set(permissionIds)];
        const update$: Observable<RolUpdateResponse> = detail.isSystem ? of({ idRole, rowVersion: detail.rowVersion, mensaje: '' }) : this.api.update(idRole, { name, description, rowVersion: detail.rowVersion }).pipe(tap(result => this.setRowVersion(result.rowVersion)));
        update$.pipe(switchMap(result => this.api.updatePermissions(idRole, permissions, result.rowVersion)), tap(result => this.setRowVersion(result.rowVersion))).subscribe({ next: result => { this.assignedIdsSignal.set(permissions); this.finishSave({ idRole, mensaje: result.mensaje || 'Rol y permisos actualizados correctamente.' }); }, error: error => this.failSave(error, 'No se pudieron guardar los cambios del rol.') });
    }

    clearSaveError(): void { this.saveErrorSignal.set(null); }
    clearSaveResult(): void { this.saveResultSignal.set(null); }
    private beginSave(): void { this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null); }
    private finishSave(result: RolFormSaveResult): void { this.savingSignal.set(false); this.saveResultSignal.set(result); }
    private failSave(error: unknown, fallback: string): void { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, fallback)); }
    private setRowVersion(rowVersion: string): void { this.detailSignal.update(detail => detail ? { ...detail, rowVersion } : detail); }
}
