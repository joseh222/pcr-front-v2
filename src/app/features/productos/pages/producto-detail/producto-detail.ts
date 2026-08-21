import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InventarioMovementListStore } from '../../../inventario/data-access/models/inventario-movement-list.store';
import { ProductoDetailStore } from '../../data-access/models/producto-detail.store';

@Component({
    selector: 'pcr-producto-detail',
    imports: [CurrencyPipe, DatePipe, RouterLink, MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressBarModule, MatTableModule],
    providers: [ProductoDetailStore, InventarioMovementListStore],
    templateUrl: './producto-detail.html',
    styleUrl: './producto-detail.scss'
})
export class ProductoDetailPage implements OnInit {
    protected readonly store = inject(ProductoDetailStore);
    protected readonly movements = inject(InventarioMovementListStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    protected idProducto = 0;
    protected readonly movementColumns = ['fecha', 'movimiento', 'cantidad', 'stock', 'costo', 'motivo'];

    ngOnInit(): void {
        this.idProducto = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isInteger(this.idProducto) || this.idProducto <= 0) { void this.router.navigate(['/productos']); return; }
        this.store.load(this.idProducto);
        this.movements.search({ idProducto: this.idProducto, idTipoMovimiento: null, fechaInicio: null, fechaFin: null });
    }

    protected onMovementPage(event: PageEvent): void {
        if (event.pageSize !== this.movements.pageSize()) { this.movements.changePageSize(event.pageSize); return; }
        this.movements.changePage(event.pageIndex + 1);
    }
}
