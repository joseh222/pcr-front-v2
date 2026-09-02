import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';
import { getApiErrorMessage } from '../../../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { FileDownloadService } from '../../../../../core/files/file-download.service';
import { ReporteComprasApiService } from '../../data-access/reporte-compras-api.service';
import { ReporteComprasFilters, ReporteComprasResponse } from '../../data-access/reporte-compras.models';

@Component({
    selector: 'pcr-reporte-compras',
    imports: [CurrencyPipe, DecimalPipe, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule],
    templateUrl: './reporte-compras.html',
    styleUrl: './reporte-compras.scss'
})
export class ReporteComprasPage implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly api = inject(ReporteComprasApiService);
    private readonly feedback = inject(FeedbackService);
    private readonly fileDownload = inject(FileDownloadService);

    protected readonly loading = signal(false);
    protected readonly exportingExcel = signal(false);
    protected readonly exportingPdf = signal(false);
    protected readonly report = signal<ReporteComprasResponse | null>(null);
    protected readonly maxProveedor = computed(() => Math.max(0, ...(this.report()?.proveedores.map(item => item.total) ?? [])));
    protected readonly maxDia = computed(() => Math.max(0, ...(this.report()?.tendenciaDiaria.map(item => item.total) ?? [])));
    protected readonly maxProducto = computed(() => Math.max(0, ...(this.report()?.productos.map(item => item.total) ?? [])));

    private readonly initialRange = this.currentMonthRange();
    readonly filterForm = this.fb.group({ fechaInicio: this.fb.nonNullable.control(this.initialRange.fechaInicio), fechaFin: this.fb.nonNullable.control(this.initialRange.fechaFin) });

    ngOnInit(): void { this.load(); }

    protected search(): void {
        const filters = this.filterForm.getRawValue();
        if (!filters.fechaInicio || !filters.fechaFin) { this.feedback.warning('Selecciona el rango de fechas del reporte.'); return; }
        if (filters.fechaInicio > filters.fechaFin) { this.feedback.warning('La fecha desde no puede ser mayor que la fecha hasta.'); return; }
        this.load();
    }

    protected currentDay(): void {
        const today = this.toDateInput(new Date());
        this.filterForm.reset({ fechaInicio: today, fechaFin: today });
        this.load();
    }

    protected currentMonth(): void {
        const range = this.currentMonthRange();
        this.filterForm.reset(range);
        this.load();
    }

    protected exportExcel(): void {
        if (!this.canExport() || this.exportingExcel() || this.exportingPdf()) return;
        this.exportingExcel.set(true);
        this.api.exportExcel(this.currentFilters()).pipe(finalize(() => this.exportingExcel.set(false))).subscribe({
            next: blob => { this.fileDownload.download(blob, this.buildExportFileName('xlsx')); this.feedback.success('Excel del reporte de compras generado correctamente.'); },
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo exportar el reporte a Excel.'))
        });
    }

    protected exportPdf(): void {
        if (!this.canExport() || this.exportingExcel() || this.exportingPdf()) return;
        this.exportingPdf.set(true);
        this.api.exportPdf(this.currentFilters()).pipe(finalize(() => this.exportingPdf.set(false))).subscribe({
            next: blob => { this.fileDownload.download(blob, this.buildExportFileName('pdf')); this.feedback.success('PDF del reporte de compras generado correctamente.'); },
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo exportar el reporte a PDF.'))
        });
    }

    protected canExport(): boolean { return (this.report()?.cantidadCompras ?? 0) > 0 || (this.report()?.cantidadAnuladas ?? 0) > 0; }

    protected percentage(value: number, max: number): number {
        if (max <= 0 || value <= 0) return 0;
        return Math.max(4, Math.min(100, (value / max) * 100));
    }

    protected formatDate(value: string): string {
        const date = value.slice(0, 10).split('-');
        return date.length === 3 ? `${date[2]}/${date[1]}/${date[0]}` : value;
    }

    private load(): void {
        if (this.loading()) return;
        const filters = this.currentFilters();
        this.loading.set(true);
        this.api.get(filters).pipe(finalize(() => this.loading.set(false))).subscribe({
            next: response => this.report.set(response),
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar el reporte de compras.'))
        });
    }

    private currentFilters(): ReporteComprasFilters {
        const raw = this.filterForm.getRawValue();
        return { fechaInicio: raw.fechaInicio, fechaFin: raw.fechaFin };
    }

    private buildExportFileName(extension: 'xlsx' | 'pdf'): string {
        const now = new Date();
        const two = (value: number) => value.toString().padStart(2, '0');
        const stamp = `${now.getFullYear()}${two(now.getMonth() + 1)}${two(now.getDate())}_${two(now.getHours())}${two(now.getMinutes())}${two(now.getSeconds())}`;
        return `Reporte_Compras_${stamp}.${extension}`;
    }

    private currentMonthRange(): { fechaInicio: string; fechaFin: string } {
        const now = new Date();
        const first = new Date(now.getFullYear(), now.getMonth(), 1);
        return { fechaInicio: this.toDateInput(first), fechaFin: this.toDateInput(now) };
    }

    private toDateInput(value: Date): string {
        const two = (part: number) => part.toString().padStart(2, '0');
        return `${value.getFullYear()}-${two(value.getMonth() + 1)}-${two(value.getDate())}`;
    }
}
