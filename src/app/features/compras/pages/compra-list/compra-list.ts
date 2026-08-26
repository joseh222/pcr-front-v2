import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProveedorSearchItem } from '../../../proveedores/data-access/models/proveedor-read.models';
import { CompraCancellationService } from '../../data-access/compra-cancellation.service';
import { CompraListStore } from '../../data-access/models/compra-list.store';
import { CompraListFilters, CompraListItem } from '../../data-access/models/compra-read.models';

@Component({
    selector: 'pcr-compra-list',
    imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatTableModule],
    providers: [CompraListStore],
    templateUrl: './compra-list.html',
    styleUrl: './compra-list.scss'
})
export class CompraListPage implements OnInit {
    protected readonly store = inject(CompraListStore);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly cancellation = inject(CompraCancellationService);
    protected readonly selectedProveedor = signal<ProveedorSearchItem | null>(null);

    readonly filterForm = this.fb.group({
        search: this.fb.nonNullable.control(''), proveedorSearch: this.fb.nonNullable.control(''), idProveedor: this.fb.control<number | null>(null),
        idTipoComprobanteCompra: this.fb.control<number | null>(null), idEstadoCompra: this.fb.control<number | null>(null),
        fechaInicio: this.fb.control<string | null>(null), fechaFin: this.fb.control<string | null>(null)
    });

    protected readonly displayedColumns = ['codigo', 'fecha', 'proveedor', 'comprobante', 'productos', 'estado', 'total', 'acciones'];

    ngOnInit(): void {
        this.store.loadCatalogs(); this.store.load();
        this.filterForm.controls.proveedorSearch.valueChanges.pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(value => this.store.searchProveedores(value));
    }

    protected selectProveedor(proveedor: ProveedorSearchItem): void {
        this.selectedProveedor.set(proveedor); this.store.clearProveedorResults();
        this.filterForm.patchValue({ idProveedor: proveedor.idProveedor, proveedorSearch: '' }, { emitEvent: false });
    }

    protected clearProveedor(): void {
        this.selectedProveedor.set(null); this.store.clearProveedorResults();
        this.filterForm.patchValue({ idProveedor: null, proveedorSearch: '' }, { emitEvent: false });
    }

    protected search(): void {
        if (this.dateRangeInvalid()) return;
        const raw = this.filterForm.getRawValue();
        const filters: CompraListFilters = { search: raw.search, idProveedor: raw.idProveedor, idTipoComprobanteCompra: raw.idTipoComprobanteCompra, idEstadoCompra: raw.idEstadoCompra, fechaInicio: raw.fechaInicio, fechaFin: raw.fechaFin };
        this.store.search(filters);
    }

    protected clearFilters(): void {
        this.selectedProveedor.set(null); this.store.clearProveedorResults();
        this.filterForm.reset({ search: '', proveedorSearch: '', idProveedor: null, idTipoComprobanteCompra: null, idEstadoCompra: null, fechaInicio: null, fechaFin: null });
        this.store.resetFilters();
    }

    protected cancel(compra: CompraListItem): void { if (!compra.puedeAnular) return; this.cancellation.cancel(compra).subscribe(result => { if (result) this.store.reload(); }); }
    protected reload(): void { this.store.reload(); }
    protected onPage(event: PageEvent): void { if (event.pageSize !== this.store.pageSize()) { this.store.changePageSize(event.pageSize); return; } this.store.changePage(event.pageIndex + 1); }
    protected dateRangeInvalid(): boolean { const { fechaInicio, fechaFin } = this.filterForm.getRawValue(); return !!fechaInicio && !!fechaFin && fechaInicio > fechaFin; }
    protected comprobante(serie: string | null, numero: string | null): string { return [serie, numero].filter(Boolean).join('-') || 'Sin número'; }
}
