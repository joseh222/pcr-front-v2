import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PermisoGroup, PermisoItem } from '../../data-access/models/rol-api.models';
import { RolFormStore } from '../../data-access/models/rol-form.store';

@Component({ selector: 'pcr-rol-form', imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule], providers: [RolFormStore], templateUrl: './rol-form.html', styleUrl: './rol-form.scss' })
export class RolFormPage implements OnInit {
    protected readonly store = inject(RolFormStore); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); private readonly fb = inject(FormBuilder); private readonly feedback = inject(FeedbackService); private readonly authStore = inject(AuthStore);
    protected readonly idRole = signal<number | null>(null); protected readonly isEditMode = computed(() => this.idRole() !== null); protected readonly detail = computed(() => this.store.detail()); protected readonly isSystem = computed(() => !!this.detail()?.isSystem); protected readonly grantsAllPermissions = computed(() => !!this.detail()?.grantsAllPermissions);
    protected readonly canCreate = computed(() => this.authStore.hasPermission(PERMISSION_CODE.ROLE_CREATE)); protected readonly canEdit = computed(() => this.authStore.hasPermission(PERMISSION_CODE.ROLE_EDIT)); protected readonly canAssignPermissions = computed(() => this.authStore.hasPermission(PERMISSION_CODE.ROLE_ASSIGN_PERMISSIONS)); protected readonly canEditData = computed(() => this.isEditMode() ? this.canEdit() && !this.isSystem() : this.canCreate()); protected readonly permissionsLocked = computed(() => this.grantsAllPermissions() || !this.canAssignPermissions()); protected readonly canSave = computed(() => !this.grantsAllPermissions() && (this.isEditMode() ? this.canEditData() || this.canAssignPermissions() : this.canCreate()));
    protected readonly pageTitle = computed(() => this.isEditMode() ? 'Rol y permisos' : 'Nuevo rol'); protected readonly pageDescription = computed(() => this.isEditMode() ? 'Consulta el rol y administra únicamente las acciones permitidas para tu usuario.' : 'Crea un rol personalizado y define sus permisos de acceso.');
    protected readonly permissionGroups = computed<readonly PermisoGroup[]>(() => { const groups = new Map<string, PermisoItem[]>(); for (const permission of [...this.store.permissions()].sort((a,b) => a.orden - b.orden || a.codigo.localeCompare(b.codigo))) { const key = permission.modulo?.trim() || 'OTROS'; const items = groups.get(key) ?? []; items.push(permission); groups.set(key, items); } return [...groups.entries()].map(([module, permissions]) => ({ module, permissions })); });
    readonly form = this.fb.group({ code: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9_]+$/)]), name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]), description: this.fb.nonNullable.control('', Validators.maxLength(250)), permissions: this.fb.nonNullable.control<number[]>([]) });

    private readonly syncDetail = effect(() => { const detail = this.store.detail(); if (!detail) return; this.form.patchValue({ code: detail.code, name: detail.name, description: detail.description ?? '', permissions: [...this.store.assignedPermissionIds()] }, { emitEvent: false }); this.syncControlAccess(); });
    private readonly syncAccess = effect(() => { this.canEditData(); this.permissionsLocked(); this.isEditMode(); this.syncControlAccess(); });
    private readonly syncCreatePermissions = effect(() => { if (this.isEditMode() || this.store.loading()) return; this.form.controls.permissions.setValue([...this.store.assignedPermissionIds()], { emitEvent: false }); });
    private readonly syncSaveError = effect(() => { const error = this.store.saveError(); if (!error) return; this.feedback.error(error); this.store.clearSaveError(); });
    private readonly syncSaveResult = effect(() => { const result = this.store.saveResult(); if (!result) return; this.store.clearSaveResult(); void this.router.navigate(['/seguridad/roles']).then(() => this.feedback.success(result.mensaje)); });

    ngOnInit(): void { const rawId = this.route.snapshot.paramMap.get('id'); if (rawId === null) { this.store.initialize(null); this.syncControlAccess(); return; } const id = Number(rawId); if (!Number.isInteger(id) || id <= 0) { void this.router.navigate(['/seguridad/roles']); return; } this.idRole.set(id); this.store.initialize(id); }
    protected save(): void {
        this.form.markAllAsTouched(); if (this.form.invalid || this.store.saving() || !this.canSave()) return;
        const value = this.form.getRawValue(); const permissions = [...new Set(value.permissions)]; const description = value.description.trim() || null; const id = this.idRole();
        if (id === null) { this.store.create({ code: value.code.trim().toUpperCase(), name: value.name.trim(), description }, permissions, this.canAssignPermissions()); return; }
        this.store.update(id, value.name.trim(), description, permissions, this.canEditData(), this.canAssignPermissions() && !this.grantsAllPermissions());
    }
    protected isSelected(idPermiso: number): boolean { return this.form.controls.permissions.value.includes(idPermiso); }
    protected togglePermission(idPermiso: number, checked: boolean): void { if (this.permissionsLocked()) return; const selected = new Set(this.form.controls.permissions.value); checked ? selected.add(idPermiso) : selected.delete(idPermiso); this.form.controls.permissions.setValue([...selected]); }
    protected groupSelected(group: PermisoGroup): boolean { return group.permissions.length > 0 && group.permissions.every(permission => this.isSelected(permission.idPermiso)); }
    protected groupIndeterminate(group: PermisoGroup): boolean { const selected = group.permissions.filter(permission => this.isSelected(permission.idPermiso)).length; return selected > 0 && selected < group.permissions.length; }
    protected toggleGroup(group: PermisoGroup, checked: boolean): void { if (this.permissionsLocked()) return; const selected = new Set(this.form.controls.permissions.value); group.permissions.forEach(permission => checked ? selected.add(permission.idPermiso) : selected.delete(permission.idPermiso)); this.form.controls.permissions.setValue([...selected]); }
    protected allSelected(): boolean { const permissions = this.store.permissions(); return permissions.length > 0 && permissions.every(permission => this.isSelected(permission.idPermiso)); }
    protected allIndeterminate(): boolean { const total = this.store.permissions().length; const selected = this.form.controls.permissions.value.length; return selected > 0 && selected < total; }
    protected toggleAll(checked: boolean): void { if (this.permissionsLocked()) return; this.form.controls.permissions.setValue(checked ? this.store.permissions().map(permission => permission.idPermiso) : []); }
    protected moduleLabel(module: string): string { return module.replaceAll('_', ' '); }
    private syncControlAccess(): void { const lockData = this.isEditMode() ? !this.canEditData() : !this.canCreate(); if (lockData || this.isEditMode()) this.form.controls.code.disable({ emitEvent: false }); else this.form.controls.code.enable({ emitEvent: false }); if (lockData) { this.form.controls.name.disable({ emitEvent: false }); this.form.controls.description.disable({ emitEvent: false }); } else { this.form.controls.name.enable({ emitEvent: false }); this.form.controls.description.enable({ emitEvent: false }); } if (this.permissionsLocked()) this.form.controls.permissions.disable({ emitEvent: false }); else this.form.controls.permissions.enable({ emitEvent: false }); }
}
