import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ProductoApiService } from '../../../productos/data-access/producto-api.service';
import { ProductoListItem } from '../../../productos/data-access/models/producto-read.models';
import { InventarioApiService } from '../../data-access/inventario-api.service';
import { InventarioMovementListStore } from '../../data-access/models/inventario-movement-list.store';
import { MovimientoInventarioListFilters, TipoMovimientoInventario } from '../../data-access/models/inventario.models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'pcr-movimiento-list',
    imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatTableModule],
    providers: [InventarioMovementListStore],
    templateUrl: './movimiento-list.html',
    styleUrl: './movimiento-list.scss'
})
export class MovimientoListPage implements OnInit {
    protected readonly store = inject(InventarioMovementListStore);
    private readonly inventoryApi = inject(InventarioApiService);
    private readonly productApi = inject(ProductoApiService);
    private readonly feedback = inject(FeedbackService);
    private readonly route = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    protected readonly tipos = signal<readonly TipoMovimientoInventario[]>([]);
    protected readonly productos = signal<readonly ProductoListItem[]>([]);
    protected readonly displayedColumns = ['fecha', 'producto', 'movimiento', 'cantidad', 'stock', 'costo', 'motivo'];
    readonly filterForm = this.fb.group({ idProducto: this.fb.control<number | null>(null), idTipoMovimiento: this.fb.control<number | null>(null), fechaInicio: this.fb.control<string | null>(null), fechaFin: this.fb.control<string | null>(null) });

    ngOnInit(): void {
        const productId = Number(this.route.snapshot.queryParamMap.get('productoId'));
        if (Number.isInteger(productId) && productId > 0) this.filterForm.controls.idProducto.setValue(productId);
        forkJoin({ tipos: this.inventoryApi.getTiposMovimientoHistorial(), productos: this.productApi.getList({ search: null, idCategoriaProducto: null, idMarcaProducto: null, isActive: null, pageNumber: 1, pageSize: 100 }) }).subscribe({
            next: ({ tipos, productos }) => { this.tipos.set(tipos); this.productos.set(productos.items); },
            error: () => this.feedback.warning('No se pudieron cargar algunos filtros de inventario.')
        });
        this.search();
    }

    protected search(): void { this.store.search(this.filterForm.getRawValue() as MovimientoInventarioListFilters); }
    protected clearFilters(): void { this.filterForm.reset({ idProducto: null, idTipoMovimiento: null, fechaInicio: null, fechaFin: null }); this.search(); }
    protected reload(): void { this.store.reload(); }
    protected onPage(event: PageEvent): void { if (event.pageSize !== this.store.pageSize()) { this.store.changePageSize(event.pageSize); return; } this.store.changePage(event.pageIndex + 1); }
}
