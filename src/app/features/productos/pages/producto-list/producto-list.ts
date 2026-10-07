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
import { ProductoListStore } from '../../data-access/models/producto-list.store';
import { ProductoListFilters, ProductoListItem } from '../../data-access/models/producto-read.models';
import { ProductoStatusService } from '../../data-access/producto-status.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';

@Component({
    selector: 'pcr-producto-list',
    imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatTableModule],
    providers: [ProductoListStore],
    templateUrl: './producto-list.html',
    styleUrl: './producto-list.scss'
})
export class ProductoListPage implements OnInit {
    protected readonly store = inject(ProductoListStore);
    private readonly fb = inject(FormBuilder);
    private readonly statusService = inject(ProductoStatusService);
    private readonly authStore = inject(AuthStore);
    protected readonly canCreate = () => this.authStore.hasPermission(PERMISSION_CODE.PRODUCT_CREATE);
    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.PRODUCT_EDIT);
    protected readonly canChangeStatus = () => this.authStore.hasPermission(PERMISSION_CODE.PRODUCT_STATUS);

    readonly filterForm = this.fb.group({
        search: this.fb.nonNullable.control(''),
        idCategoriaProducto: this.fb.control<number | null>(null),
        idMarcaProducto: this.fb.control<number | null>(null),
        isActive: this.fb.control<boolean | null>(true)
    });

    protected readonly displayedColumns = ['codigo', 'producto', 'categoria', 'marca', 'precio', 'stock', 'estado', 'acciones'];

    ngOnInit(): void { this.store.loadCatalogs(); this.store.load(); }
    protected search(): void { this.store.search(this.filterForm.getRawValue() as ProductoListFilters); }
    protected clearFilters(): void {
        this.filterForm.reset({ search: '', idCategoriaProducto: null, idMarcaProducto: null, isActive: true });
        this.store.resetFilters();
    }
    protected reload(): void { this.store.reload(); }
    protected onPage(event: PageEvent): void {
        if (event.pageSize !== this.store.pageSize()) { this.store.changePageSize(event.pageSize); return; }
        this.store.changePage(event.pageIndex + 1);
    }
    protected changeStatus(producto: ProductoListItem): void {
        if (!this.canChangeStatus()) return;
        this.statusService.change(producto).subscribe(result => { if (result) this.store.reload(); });
    }
}
