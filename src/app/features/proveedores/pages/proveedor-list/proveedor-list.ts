import { Component, OnInit, inject } from '@angular/core';
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
import { ProveedorListStore } from '../../data-access/models/proveedor-list.store';
import { ProveedorListFilters, ProveedorListItem } from '../../data-access/models/proveedor-read.models';
import { ProveedorStatusService } from '../../data-access/proveedor-status.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';

@Component({
    selector: 'pcr-proveedor-list',
    imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatTableModule],
    providers: [ProveedorListStore],
    templateUrl: './proveedor-list.html',
    styleUrl: './proveedor-list.scss'
})
export class ProveedorListPage implements OnInit {
    protected readonly store = inject(ProveedorListStore);
    private readonly fb = inject(FormBuilder);
    private readonly statusService = inject(ProveedorStatusService);
    private readonly authStore = inject(AuthStore);
    protected readonly canCreate = () => this.authStore.hasPermission(PERMISSION_CODE.SUPPLIER_CREATE);
    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.SUPPLIER_EDIT);
    protected readonly canChangeStatus = () => this.authStore.hasPermission(PERMISSION_CODE.SUPPLIER_STATUS);

    readonly filterForm = this.fb.group({
        search: this.fb.nonNullable.control(''),
        idTipoDocumento: this.fb.control<number | null>(null),
        isActive: this.fb.control<boolean | null>(true)
    });

    protected readonly displayedColumns = ['codigo', 'proveedor', 'documento', 'contacto', 'estado', 'acciones'];

    ngOnInit(): void { this.store.loadCatalogs(); this.store.load(); }
    protected search(): void { this.store.search(this.filterForm.getRawValue() as ProveedorListFilters); }
    protected clearFilters(): void {
        this.filterForm.reset({ search: '', idTipoDocumento: null, isActive: true });
        this.store.resetFilters();
    }
    protected reload(): void { this.store.reload(); }
    protected onPage(event: PageEvent): void {
        if (event.pageSize !== this.store.pageSize()) { this.store.changePageSize(event.pageSize); return; }
        this.store.changePage(event.pageIndex + 1);
    }
    protected changeStatus(proveedor: ProveedorListItem): void {
        if (!this.canChangeStatus()) return;
        this.statusService.change(proveedor).subscribe(result => { if (result) this.store.reload(); });
    }
}
