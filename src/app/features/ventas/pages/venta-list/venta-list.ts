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
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { VentaListStore } from '../../data-access/models/venta-list.store';
import { VentaListFilters, VentaListItem, VentaTipoItemFiltro } from '../../data-access/models/venta-read.models';
import { VentaCancellationService } from '../../data-access/venta-cancellation.service';
import { VentaApiService } from '../../data-access/venta-api.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { FileDownloadService } from '../../../../core/files/file-download.service';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';

@Component({
    selector: 'pcr-venta-list',
    imports: [
        CurrencyPipe,
        DatePipe,
        ReactiveFormsModule,
        RouterLink,

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTableModule
    ],

    providers: [VentaListStore],
    templateUrl: './venta-list.html',
    styleUrl: './venta-list.scss'
})
export class VentaListPage implements OnInit {

    protected readonly store = inject(VentaListStore);
    private readonly fb = inject(FormBuilder);
    private readonly cancellation = inject(VentaCancellationService);
    private readonly authStore = inject(AuthStore);
    private readonly api = inject(VentaApiService);
    private readonly fileDownload = inject(FileDownloadService);
    private readonly feedback = inject(FeedbackService);
    protected readonly exportingExcel = signal(false);
    protected readonly exportingPdf = signal(false);
    protected readonly canCreate = () => this.authStore.hasPermission(PERMISSION_CODE.SALE_CREATE);
    protected readonly canExport = () => this.authStore.hasPermission(PERMISSION_CODE.SALE_EXPORT);
    protected readonly canCancel = (venta: VentaListItem) => this.authStore.hasPermission(PERMISSION_CODE.SALE_CANCEL) && venta.puedeAnular;

    readonly filterForm = this.fb.group({
        texto: this.fb.nonNullable.control(''),
        fechaInicio: this.fb.control<string | null>(null),
        fechaFin: this.fb.control<string | null>(null),
        idMetodoPago: this.fb.control<number | null>(null),
        idTipoComprobante: this.fb.control<number | null>(null),
        tipoItem: this.fb.control<VentaTipoItemFiltro | null>(null)
    });

    protected readonly displayedColumns:
        string[] = [
            'codigo',
            'fecha',
            'cliente',
            'comprobante',
            'metodoPago',
            'contenido',
            'estado',
            'total',
            'acciones'
        ];

    protected readonly itemTypes = [
        {
            value: 'PRODUCTO' as const,
            label: 'Productos'
        },
        {
            value: 'SERVICIO' as const,
            label: 'Servicios'
        }
    ];

    ngOnInit(): void {
        this.store.loadCatalogs();
        this.store.load();
    }

    protected search(): void {
        this.store.search(this.filterForm.getRawValue() as VentaListFilters);
    }

    protected clearFilters(): void {
        this.filterForm.reset({
            texto: '',
            fechaInicio: null,
            fechaFin: null,
            idMetodoPago: null,
            idTipoComprobante: null,
            tipoItem: null
        });
        this.store.resetFilters();
    }

    protected reload(): void {
        this.store.reload();
    }

    protected onPage(event: PageEvent): void {
        if (event.pageSize !== this.store.tamanoPagina()) {
            this.store.changePageSize(event.pageSize);
            return;
        }
        this.store.changePage(event.pageIndex + 1);
    }

    protected cancelSale(venta: VentaListItem): void {
        if (!this.canCancel(venta)) return;

        this.cancellation.cancel(venta).subscribe(result => {
            if (result) this.store.reload();
        });
    }

    protected exportExcel(): void {
        if (!this.canExport() || this.store.totalRegistros() === 0 || this.exportingExcel() || this.exportingPdf()) return;
        this.exportingExcel.set(true);
        this.api.exportExcel(this.store.query()).pipe(finalize(() => this.exportingExcel.set(false))).subscribe({
            next: blob => { this.fileDownload.download(blob, this.buildExportFileName('xlsx')); this.feedback.success('Excel de ventas generado correctamente.'); },
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo exportar las ventas a Excel.'))
        });
    }

    protected exportPdf(): void {
        if (!this.canExport() || this.store.totalRegistros() === 0 || this.exportingExcel() || this.exportingPdf()) return;
        this.exportingPdf.set(true);
        this.api.exportPdf(this.store.query()).pipe(finalize(() => this.exportingPdf.set(false))).subscribe({
            next: blob => { this.fileDownload.download(blob, this.buildExportFileName('pdf')); this.feedback.success('PDF de ventas generado correctamente.'); },
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo exportar las ventas a PDF.'))
        });
    }

    private buildExportFileName(extension: 'xlsx' | 'pdf'): string {
        const now = new Date();
        const two = (value: number) => value.toString().padStart(2, '0');
        const stamp = `${now.getFullYear()}${two(now.getMonth() + 1)}${two(now.getDate())}_${two(now.getHours())}${two(now.getMinutes())}${two(now.getSeconds())}`;
        return `Ventas_${stamp}.${extension}`;
    }

    protected contentLabel(tieneProductos: boolean, tieneServicios: boolean): string {
        if (tieneProductos && tieneServicios) {
            return 'Productos + servicios';
        }

        if (tieneProductos) {
            return 'Productos';
        }

        if (tieneServicios) {
            return 'Servicios';
        }

        return 'Sin detalle';
    }
}