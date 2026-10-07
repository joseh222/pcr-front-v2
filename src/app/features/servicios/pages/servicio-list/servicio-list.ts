import { CurrencyPipe } from '@angular/common';
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
import { ServicioModoPrecio } from '../../data-access/models/servicio-catalog.models';
import { ServicioListStore } from '../../data-access/models/servicio-list.store';
import { ServicioListFilters, ServicioListItem } from '../../data-access/models/servicio-read.models';
import { ServicioStatusService } from '../../data-access/servicio-status.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';

@Component({
    selector: 'pcr-servicio-list',
    imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatTableModule],
    providers: [ServicioListStore],
    templateUrl: './servicio-list.html',
    styleUrl: './servicio-list.scss'
})
export class ServicioListPage implements OnInit {
    protected readonly store = inject(ServicioListStore);
    private readonly fb = inject(FormBuilder);
    private readonly statusService = inject(ServicioStatusService);
    private readonly authStore = inject(AuthStore);
    protected readonly canCreate = () => this.authStore.hasPermission(PERMISSION_CODE.SERVICE_CATALOG_CREATE);
    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.SERVICE_CATALOG_EDIT);
    protected readonly canChangeStatus = () => this.authStore.hasPermission(PERMISSION_CODE.SERVICE_CATALOG_STATUS);

    readonly filterForm = this.fb.group({
        search: this.fb.nonNullable.control(''),
        idCategoriaServicio: this.fb.control<number | null>(null),
        modoPrecio: this.fb.control<ServicioModoPrecio | null>(null),
        isActive: this.fb.control<boolean | null>(true)
    });

    protected readonly displayedColumns = ['codigo', 'servicio', 'categoria', 'modoPrecio', 'precioBase', 'estado', 'acciones'];

    ngOnInit(): void { this.store.loadCatalogs(); this.store.load(); }
    protected search(): void { this.store.search(this.filterForm.getRawValue() as ServicioListFilters); }
    protected clearFilters(): void {
        this.filterForm.reset({ search: '', idCategoriaServicio: null, modoPrecio: null, isActive: true });
        this.store.resetFilters();
    }
    protected reload(): void { this.store.reload(); }
    protected onPage(event: PageEvent): void {
        if (event.pageSize !== this.store.pageSize()) { this.store.changePageSize(event.pageSize); return; }
        this.store.changePage(event.pageIndex + 1);
    }
    protected changeStatus(servicio: ServicioListItem): void {
        this.statusService.change(servicio).subscribe(result => { if (result) this.store.reload(); });
    }
}
