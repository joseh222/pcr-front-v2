import { CurrencyPipe } from '@angular/common';
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

import { MisaListStore } from '../../data-access/models/misa-list.store';
import { MisaListFilters } from '../../data-access/models/misa-read.models';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { MisaApiService } from '../../data-access/misa-api.service';
import { FileDownloadService } from '../../../../core/files/file-download.service';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { finalize } from 'rxjs';

@Component({
    selector: 'pcr-misa-list',
    imports: [
        CurrencyPipe,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTableModule,
        RouterLink
    ],
    providers: [MisaListStore],
    templateUrl: './misa-list.html',
    styleUrl: './misa-list.scss'
})
export class MisaListPage implements OnInit {
    protected readonly store =
        inject(MisaListStore);

    private readonly fb = inject(FormBuilder);
    private readonly authStore = inject(AuthStore);
    private readonly api = inject(MisaApiService);
    private readonly fileDownload = inject(FileDownloadService);
    private readonly feedback = inject(FeedbackService);
    protected readonly exportingExcel = signal(false);
    protected readonly exportingPdf = signal(false);
    private readonly appliedFilters = signal<MisaListFilters>({ texto: '', fechaInicio: null, fechaFin: null, idModalidad: null, idTipo: null, idEstado: null, estadoPago: null });
    protected readonly canCreate = () => this.authStore.hasPermission(PERMISSION_CODE.MASS_CREATE);
    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.MASS_EDIT);
    protected readonly canExport = () => this.authStore.hasPermission(PERMISSION_CODE.MASS_EXPORT);

    readonly filterForm = this.fb.group({
        texto: this.fb.nonNullable.control(''),
        fechaInicio: this.fb.control<string | null>(null),
        fechaFin: this.fb.control<string | null>(null),
        idModalidad: this.fb.control<number | null>(null),
        idTipo: this.fb.control<number | null>(null),
        idEstado: this.fb.control<number | null>(null),
        estadoPago: this.fb.control<string | null>(null)
    });

    protected readonly displayedColumns: string[] = [
        'codigo',
        'fecha',
        'tipo',
        'solicitante',
        'estado',
        'pago',
        'importe',
        'intenciones',
        'acciones'
    ];

    protected readonly paymentStatuses = [
        {
            value: 'PENDIENTE',
            label: 'Pendiente'
        },
        {
            value: 'PAGADO',
            label: 'Pagado'
        },
        {
            value: 'NO_REQUIERE_PAGO',
            label: 'No requiere pago'
        }
    ] as const;

    ngOnInit(): void {
        this.store.loadCatalogs();
        this.store.load();
    }

    protected search(): void {
        const filters: MisaListFilters =
            this.filterForm.getRawValue();

        this.appliedFilters.set(filters);
        this.store.search(filters);
    }

    protected clearFilters(): void {
        this.filterForm.reset({
            texto: '',
            fechaInicio: null,
            fechaFin: null,
            idModalidad: null,
            idTipo: null,
            idEstado: null,
            estadoPago: null
        });

        this.appliedFilters.set({ texto: '', fechaInicio: null, fechaFin: null, idModalidad: null, idTipo: null, idEstado: null, estadoPago: null });
        this.store.resetFilters();
    }

    protected reload(): void {
        this.store.reload();
    }

    protected exportExcel(): void {
        if (!this.canExport() || this.store.totalRegistros() === 0 || this.exportingExcel() || this.exportingPdf()) return;
        this.exportingExcel.set(true);
        this.api.exportExcel(this.appliedFilters()).pipe(finalize(() => this.exportingExcel.set(false))).subscribe({
            next: blob => { this.fileDownload.download(blob, this.buildExportFileName('xlsx')); this.feedback.success('Excel de misas generado correctamente.'); },
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo exportar las misas a Excel.'))
        });
    }

    protected exportPdf(): void {
        if (!this.canExport() || this.store.totalRegistros() === 0 || this.exportingExcel() || this.exportingPdf()) return;
        this.exportingPdf.set(true);
        this.api.exportPdf(this.appliedFilters()).pipe(finalize(() => this.exportingPdf.set(false))).subscribe({
            next: blob => { this.fileDownload.download(blob, this.buildExportFileName('pdf')); this.feedback.success('PDF de misas generado correctamente.'); },
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo exportar las misas a PDF.'))
        });
    }

    private buildExportFileName(extension: 'xlsx' | 'pdf'): string {
        const now = new Date();
        const two = (value: number) => value.toString().padStart(2, '0');
        const stamp = `${now.getFullYear()}${two(now.getMonth() + 1)}${two(now.getDate())}_${two(now.getHours())}${two(now.getMinutes())}${two(now.getSeconds())}`;
        return `Misas_${stamp}.${extension}`;
    }

    protected onPage(event: PageEvent): void {
        if (
            event.pageSize !==
            this.store.tamanoPagina()
        ) {
            this.store.changePageSize(
                event.pageSize
            );

            return;
        }

        this.store.changePage(
            event.pageIndex + 1
        );
    }

    protected formatDate(
        value: string | null
    ): string {
        if (!value) {
            return '—';
        }

        const date = value.slice(0, 10);
        const parts = date.split('-');

        if (parts.length !== 3) {
            return value;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    protected formatTime(
        value: string | null
    ): string {
        if (!value) {
            return '—';
        }

        return value.slice(0, 5);
    }

    protected paymentLabel(
        estadoPago: string | null
    ): string {
        switch (estadoPago) {
            case 'PENDIENTE':
                return 'Pendiente';

            case 'PAGADO':
                return 'Pagado';

            case 'NO_REQUIERE_PAGO':
                return 'No requiere pago';

            default:
                return 'Sin información';
        }
    }
}