import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { MisaApiService } from '../../data-access/misa-api.service';
import { MisaCalendarItem } from '../../data-access/models/misa-calendar.models';

type CalendarDay = { date: string; day: number; inMonth: boolean; isToday: boolean; isSelected: boolean; items: readonly MisaCalendarItem[]; total: number; personal: number; comunitario: number; pending: number; hours: readonly { hora: string; total: number }[] };
type CalendarHourGroup = { hora: string; items: readonly MisaCalendarItem[]; total: number; personal: number; comunitario: number; pending: number; closed: boolean };

@Component({
    selector: 'pcr-misa-calendar',
    imports: [MatButtonModule, MatIconModule, MatProgressBarModule, RouterLink],
    templateUrl: './misa-calendar.html',
    styleUrl: './misa-calendar.scss'
})
export class MisaCalendarComponent implements OnInit {
    private readonly api = inject(MisaApiService);
    private readonly feedback = inject(FeedbackService);
    private readonly authStore = inject(AuthStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly loading = signal(false);
    protected readonly items = signal<readonly MisaCalendarItem[]>([]);
    protected readonly month = signal(this.firstDayOfMonth(new Date()));
    protected readonly selectedDate = signal(this.toIsoDate(new Date()));
    protected readonly expandedHour = signal<string | null>(null);
    protected readonly canCreate = () => this.authStore.hasPermission(PERMISSION_CODE.MASS_CREATE);
    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.MASS_EDIT);

    protected readonly weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;
    protected readonly monthLabel = computed(() => new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(this.month()));
    protected readonly gridRange = computed(() => this.buildGridRange(this.month()));
    protected readonly days = computed<readonly CalendarDay[]>(() => {
        const range = this.gridRange();
        const current = this.month();
        const currentMonth = current.getMonth();
        const today = this.toIsoDate(new Date());
        const selected = this.selectedDate();
        const byDate = new Map<string, MisaCalendarItem[]>();
        for (const item of this.items()) {
            const key = item.fecha.slice(0, 10);
            const list = byDate.get(key) ?? [];
            list.push(item);
            byDate.set(key, list);
        }
        const result: CalendarDay[] = [];
        for (let index = 0; index < 42; index++) {
            const date = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate() + index);
            const key = this.toIsoDate(date);
            const dayItems = (byDate.get(key) ?? []).slice().sort((a, b) => a.hora.localeCompare(b.hora));
            const hours = [...new Set(dayItems.map(x => x.hora.slice(0, 5)))].map(hora => ({ hora, total: dayItems.filter(x => x.hora.startsWith(hora)).length }));
            result.push({
                date: key,
                day: date.getDate(),
                inMonth: date.getMonth() === currentMonth,
                isToday: key === today,
                isSelected: key === selected,
                items: dayItems,
                total: dayItems.length,
                personal: dayItems.filter(x => this.isPersonal(x)).length,
                comunitario: dayItems.filter(x => this.isCommunity(x)).length,
                pending: dayItems.filter(x => x.pendientePago).length,
                hours
            });
        }
        return result;
    });

    protected readonly selectedItems = computed(() => this.items().filter(x => x.fecha.slice(0, 10) === this.selectedDate()).slice().sort((a, b) => a.hora.localeCompare(b.hora)));
    protected readonly selectedDateLabel = computed(() => this.formatLongDate(this.selectedDate()));
    protected readonly hourGroups = computed<readonly CalendarHourGroup[]>(() => {
        const map = new Map<string, MisaCalendarItem[]>();
        for (const item of this.selectedItems()) {
            const hora = item.hora.slice(0, 5);
            const list = map.get(hora) ?? [];
            list.push(item);
            map.set(hora, list);
        }
        return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([hora, groupItems]) => ({
            hora,
            items: groupItems,
            total: groupItems.length,
            personal: groupItems.filter(x => this.isPersonal(x)).length,
            comunitario: groupItems.filter(x => this.isCommunity(x)).length,
            pending: groupItems.filter(x => x.pendientePago).length,
            closed: groupItems.length > 0 && groupItems.every(x => x.programacionCerrada)
        }));
    });

    ngOnInit(): void {
        const dateParam = this.route.snapshot.queryParamMap.get('fecha');
        if (this.isIsoDate(dateParam)) {
            const parsed = this.parseIsoDate(dateParam!);
            this.month.set(this.firstDayOfMonth(parsed));
            this.selectedDate.set(dateParam!);
        }
        const hourParam = this.route.snapshot.queryParamMap.get('hora');
        if (/^\d{2}:\d{2}$/.test(hourParam ?? '')) this.expandedHour.set(hourParam);
        this.load();
    }

    protected previousMonth(): void { this.changeMonth(-1); }
    protected nextMonth(): void { this.changeMonth(1); }
    protected goToday(): void {
        const today = new Date();
        this.month.set(this.firstDayOfMonth(today));
        this.selectedDate.set(this.toIsoDate(today));
        this.expandedHour.set(null);
        this.syncUrl();
        this.load();
    }
    protected reload(): void { this.load(); }

    protected selectDay(day: CalendarDay): void {
        const parsed = this.parseIsoDate(day.date);
        const monthChanged = parsed.getMonth() !== this.month().getMonth() || parsed.getFullYear() !== this.month().getFullYear();
        this.selectedDate.set(day.date);
        this.expandedHour.set(null);
        if (monthChanged) {
            this.month.set(this.firstDayOfMonth(parsed));
            this.load();
        }
        this.syncUrl();
    }

    protected toggleHour(hora: string): void {
        this.expandedHour.update(current => current === hora ? null : hora);
        this.syncUrl();
    }

    protected isExpanded(hora: string): boolean { return this.expandedHour() === hora; }
    protected formatTime(value: string): string { return value.slice(0, 5); }
    protected paymentLabel(item: MisaCalendarItem): string {
        if (item.estadoPago === 'PAGADO') return 'Pagado';
        if (item.estadoPago === 'NO_REQUIERE_PAGO') return 'No requiere pago';
        if (item.estadoPago === 'PENDIENTE') return 'Pendiente';
        return 'Sin información';
    }
    protected intentionSummary(item: MisaCalendarItem): string {
        const names = item.intenciones.map(x => x.nombre?.trim()).filter((x): x is string => !!x);
        if (names.length > 0) return names.join(' · ');
        if (item.nombreSanto) return item.nombreSanto;
        if (item.motivo) return item.motivo;
        return item.nombreSolicitante || 'Sin detalle de intención';
    }
    protected returnUrl(hora?: string | null): string {
        const params = new URLSearchParams({ vista: 'calendario', fecha: this.selectedDate() });
        if (hora) params.set('hora', hora.slice(0, 5));
        return `/misas?${params.toString()}`;
    }

    private changeMonth(offset: number): void {
        const current = this.month();
        const next = new Date(current.getFullYear(), current.getMonth() + offset, 1);
        this.month.set(next);
        this.selectedDate.set(this.toIsoDate(next));
        this.expandedHour.set(null);
        this.syncUrl();
        this.load();
    }

    private load(): void {
        const range = this.buildGridRange(this.month());
        this.loading.set(true);
        this.api.getCalendar(this.toIsoDate(range.start), this.toIsoDate(range.end)).pipe(finalize(() => this.loading.set(false))).subscribe({
            next: response => {
                this.items.set(response.items ?? []);
                const requestedHour = this.expandedHour();
                if (requestedHour && !this.hourGroups().some(x => x.hora === requestedHour)) this.expandedHour.set(null);
            },
            error: error => {
                this.items.set([]);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar el calendario de misas.'));
            }
        });
    }

    private syncUrl(): void {
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { vista: 'calendario', fecha: this.selectedDate(), hora: this.expandedHour() },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    private isPersonal(item: MisaCalendarItem): boolean { return item.nombreModalidad.trim().toUpperCase() === 'PERSONAL'; }
    private isCommunity(item: MisaCalendarItem): boolean { return item.nombreModalidad.trim().toUpperCase().startsWith('COMUNIT'); }
    private firstDayOfMonth(value: Date): Date { return new Date(value.getFullYear(), value.getMonth(), 1); }
    private buildGridRange(month: Date): { start: Date; end: Date } {
        const first = this.firstDayOfMonth(month);
        const jsDay = first.getDay();
        const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
        const start = new Date(first.getFullYear(), first.getMonth(), first.getDate() + mondayOffset);
        const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 41);
        return { start, end };
    }
    private toIsoDate(value: Date): string {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    private isIsoDate(value: string | null): boolean { return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value); }
    private parseIsoDate(value: string): Date {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    private formatLongDate(value: string): string {
        const date = this.parseIsoDate(value);
        const formatted = new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(date);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
}
