import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { getApiErrorMessage } from '../../../../../core/feedback/api-error-message';
import { ReporteVentasApiService } from '../../data-access/reporte-ventas-api.service';
import { ReporteVentasFilters, ReporteVentasResponse } from '../../data-access/reporte-ventas.models';

@Component({
    selector: 'pcr-reporte-ventas',
    imports: [CurrencyPipe, DecimalPipe, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    templateUrl: './reporte-ventas.html',
    styleUrl: './reporte-ventas.scss'
})
export class ReporteVentasPage implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly api = inject(ReporteVentasApiService);
    private readonly feedback = inject(FeedbackService);

    protected readonly loading = signal(false);
    protected readonly report = signal<ReporteVentasResponse | null>(null);
    protected readonly maxMetodoPago = computed(() => Math.max(0, ...(this.report()?.metodosPago.map(item => item.total) ?? [])));
    protected readonly maxDia = computed(() => Math.max(0, ...(this.report()?.tendenciaDiaria.map(item => item.total) ?? [])));
    protected readonly maxContenido = computed(() => Math.max(0, ...(this.report()?.contenidos.map(item => item.total) ?? [])));

    private readonly initialRange = this.currentMonthRange();
    readonly filterForm = this.fb.group({
        fechaInicio: this.fb.nonNullable.control(this.initialRange.fechaInicio),
        fechaFin: this.fb.nonNullable.control(this.initialRange.fechaFin),
        tipoItem: this.fb.control<'PRODUCTO' | 'SERVICIO' | null>(null)
    });

    ngOnInit(): void { this.load(); }

    protected search(): void {
        const filters = this.filterForm.getRawValue();
        if (!filters.fechaInicio || !filters.fechaFin) {
            this.feedback.warning('Selecciona el rango de fechas del reporte.');
            return;
        }
        if (filters.fechaInicio > filters.fechaFin) {
            this.feedback.warning('La fecha desde no puede ser mayor que la fecha hasta.');
            return;
        }
        this.load();
    }

    protected currentMonth(): void {
        const range = this.currentMonthRange();
        this.filterForm.reset({ fechaInicio: range.fechaInicio, fechaFin: range.fechaFin, tipoItem: null });
        this.load();
    }

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
        const raw = this.filterForm.getRawValue();
        const filters: ReporteVentasFilters = { fechaInicio: raw.fechaInicio, fechaFin: raw.fechaFin, tipoItem: raw.tipoItem };
        this.loading.set(true);
        this.api.get(filters).pipe(finalize(() => this.loading.set(false))).subscribe({
            next: response => this.report.set(response),
            error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar el reporte de ventas.'))
        });
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
