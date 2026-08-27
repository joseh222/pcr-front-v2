import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { RolActionsService } from '../../data-access/rol-actions.service';
import { RolListFilters, RolListItem } from '../../data-access/models/rol-api.models';
import { RolListStore } from '../../data-access/models/rol-list.store';

@Component({ selector: 'pcr-rol-list', imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatTableModule], providers: [RolListStore], templateUrl: './rol-list.html', styleUrl: './rol-list.scss' })
export class RolListPage implements OnInit {
    protected readonly store = inject(RolListStore); private readonly fb = inject(FormBuilder); private readonly actions = inject(RolActionsService);
    readonly filterForm = this.fb.group({ search: this.fb.nonNullable.control(''), isActive: this.fb.control<boolean | null>(null) }); protected readonly displayedColumns = ['rol', 'tipo', 'estado', 'acciones'];
    ngOnInit(): void { this.store.load(); }
    protected search(): void { this.store.search(this.filterForm.getRawValue() as RolListFilters); }
    protected clearFilters(): void { this.filterForm.reset({ search: '', isActive: null }); this.store.resetFilters(); }
    protected reload(): void { this.store.reload(); }
    protected changeStatus(role: RolListItem): void { this.actions.changeStatus(role).subscribe(changed => { if (changed) this.store.reload(); }); }
    protected roleType(role: RolListItem): string { return role.grantsAllPermissions ? 'Administrador' : role.isSystem ? 'Sistema' : 'Personalizado'; }
}
