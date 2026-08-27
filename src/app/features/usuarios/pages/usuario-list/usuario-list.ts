import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { UsuarioActionsService } from '../../data-access/usuario-actions.service';
import { UsuarioListFilters, UsuarioListItem } from '../../data-access/models/usuario-api.models';
import { UsuarioListStore } from '../../data-access/models/usuario-list.store';

@Component({ selector: 'pcr-usuario-list', imports: [DatePipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatTableModule], providers: [UsuarioListStore], templateUrl: './usuario-list.html', styleUrl: './usuario-list.scss' })
export class UsuarioListPage implements OnInit {
    protected readonly store = inject(UsuarioListStore); private readonly fb = inject(FormBuilder); private readonly actions = inject(UsuarioActionsService); private readonly authStore = inject(AuthStore);
    protected readonly canCreate = computed(() => this.authStore.hasAllPermissions([PERMISSION_CODE.USER_CREATE, PERMISSION_CODE.USER_ASSIGN_ROLES])); protected readonly canEdit = computed(() => this.authStore.hasPermission(PERMISSION_CODE.USER_EDIT)); protected readonly canChangeStatus = computed(() => this.authStore.hasPermission(PERMISSION_CODE.USER_STATUS)); protected readonly canResetPassword = computed(() => this.authStore.hasPermission(PERMISSION_CODE.USER_RESET_PASSWORD)); protected readonly canRevokeSession = computed(() => this.authStore.hasPermission(PERMISSION_CODE.USER_SESSION_REVOKE));
    readonly filterForm = this.fb.group({ search: this.fb.nonNullable.control(''), idRole: this.fb.control<number | null>(null), isActive: this.fb.control<boolean | null>(true) }); protected readonly displayedColumns = ['usuario', 'persona', 'roles', 'seguridad', 'estado', 'ultimoAcceso', 'acciones'];
    ngOnInit(): void { this.store.loadRoles(); this.store.load(); }
    protected search(): void { this.store.search(this.filterForm.getRawValue() as UsuarioListFilters); }
    protected clearFilters(): void { this.filterForm.reset({ search: '', idRole: null, isActive: true }); this.store.resetFilters(); }
    protected reload(): void { this.store.reload(); }
    protected isSelf(user: UsuarioListItem): boolean { return this.authStore.currentUser()?.idUser === user.idUser; }
    protected changeStatus(user: UsuarioListItem): void { if (!this.canChangeStatus() || this.isSelf(user)) return; this.actions.changeStatus(user).subscribe(changed => { if (changed) this.store.reload(); }); }
    protected resetPassword(user: UsuarioListItem): void { if (!this.canResetPassword() || this.isSelf(user)) return; this.actions.resetPassword(user).subscribe(changed => { if (changed) this.store.reload(); }); }
    protected revokeSession(user: UsuarioListItem): void { if (!this.canRevokeSession() || this.isSelf(user)) return; this.actions.revokeSession(user).subscribe(changed => { if (changed) this.store.reload(); }); }
    protected onPage(event: PageEvent): void { if (event.pageSize !== this.store.pageSize()) { this.store.changePageSize(event.pageSize); return; } this.store.changePage(event.pageIndex + 1); }
}
