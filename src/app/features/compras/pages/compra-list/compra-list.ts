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
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { ProveedorSearchItem } from '../../../proveedores/data-access/models/proveedor-read.models';
import { CompraCancellationService } from '../../data-access/compra-cancellation.service';
import { CompraListStore } from '../../data-access/models/compra-list.store';
import { CompraListFilters, CompraListItem } from '../../data-access/models/compra-read.models';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { CompraApiService } from '../../data-access/compra-api.service';
import { FileDownloadService } from '../../../../core/files/file-download.service';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';

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
    private readonly authStore = inject(AuthStore);
    private readonly api = inject(CompraApiService);
    private readonly fileDownload = inject(FileDownloadService);
    private readonly feedback = inject(FeedbackService);
    protected readonly exportingExcel = signal(false);
    protected readonly exportingPdf = signal(false);
    protected readonly canCreate = () => this.authStore.hasPermission(PERMISSION_CODE.PURCHASE_CREATE);
    protected readonly canExport = () => this.authStore.hasPermission(PERMISSION_CODE.PURCHASE_EXPORT);
    protected readonly canCancel = (compra: CompraListItem) => this.authStore.hasPermission(PERMISSION_CODE.PURCHASE_CANCEL) && compra.puedeAnular;
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

    protected cancel(compra: CompraListItem): void { if (!this.canCancel(compra)) return; this.cancellation.cancel(compra).subscribe(result => { if (result) this.store.reload(); }); }

    protected exportExcel(): void {
        if (!this.canExport() || this.store.totalRows() === 0 || this.exportingExcel() || this.exportingPdf()) return;
        this.exportingExcel.set(true);
        this.api.exportExcel(this.store.query()).pipe(finalize(() => this.exportingExcel.set(false))).subscribe({
            next: blob => { this.fileDownload.download(blob, this.buildExportFileName('xlsx')); this.feedback.success('Excel de compras generado correctamente.'); },
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo exportar las compras a Excel.'))
        });
    }

    protected exportPdf(): void {
        if (!this.canExport() || this.store.totalRows() === 0 || this.exportingExcel() || this.exportingPdf()) return;
        this.exportingPdf.set(true);
        this.api.exportPdf(this.store.query()).pipe(finalize(() => this.exportingPdf.set(false))).subscribe({
            next: blob => { this.fileDownload.download(blob, this.buildExportFileName('pdf')); this.feedback.success('PDF de compras generado correctamente.'); },
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo exportar las compras a PDF.'))
        });
    }

    private buildExportFileName(extension: 'xlsx' | 'pdf'): string {
        const now = new Date();
        const two = (value: number) => value.toString().padStart(2, '0');
        const stamp = `${now.getFullYear()}${two(now.getMonth() + 1)}${two(now.getDate())}_${two(now.getHours())}${two(now.getMinutes())}${two(now.getSeconds())}`;
        return `Compras_${stamp}.${extension}`;
    }
    protected reload(): void { this.store.reload(); }
    protected onPage(event: PageEvent): void { if (event.pageSize !== this.store.pageSize()) { this.store.changePageSize(event.pageSize); return; } this.store.changePage(event.pageIndex + 1); }
    protected dateRangeInvalid(): boolean { const { fechaInicio, fechaFin } = this.filterForm.getRawValue(); return !!fechaInicio && !!fechaFin && fechaInicio > fechaFin; }
    protected comprobante(serie: string | null, numero: string | null): string { return [serie, numero].filter(Boolean).join('-') || 'Sin número'; }
}
