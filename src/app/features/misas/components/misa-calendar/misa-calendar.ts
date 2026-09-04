import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { MisaApiService } from '../../data-access/misa-api.service';
import { MisaCalendarItem, MisaProgramStatus } from '../../data-access/models/misa-calendar.models';
import { MisaReopenProgramDialog } from '../misa-reopen-program-dialog/misa-reopen-program-dialog';

type CalendarDay = { date: string; day: number; inMonth: boolean; isToday: boolean; isSelected: boolean; items: readonly MisaCalendarItem[]; total: number; personal: number; comunitario: number; pending: number; hours: readonly { hora: string; total: number }[] };
type CalendarHourGroup = { hora: string; items: readonly MisaCalendarItem[]; total: number; personal: number; comunitario: number; pending: number; closed: boolean };

@Component({
    selector: 'pcr-misa-calendar',
    imports: [MatButtonModule, MatDialogModule, MatIconModule, MatProgressBarModule, RouterLink],
    templateUrl: './misa-calendar.html',
    styleUrl: './misa-calendar.scss'
})
export class MisaCalendarComponent implements OnInit {
    private readonly api = inject(MisaApiService);
    private readonly feedback = inject(FeedbackService);
    private readonly authStore = inject(AuthStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);

    protected readonly loading = signal(false);
    protected readonly loadingProgramStatus = signal(false);
    protected readonly closingProgram = signal(false);
    protected readonly reopeningProgram = signal(false);
    protected readonly items = signal<readonly MisaCalendarItem[]>([]);
    protected readonly programStatus = signal<MisaProgramStatus | null>(null);
    protected readonly month = signal(this.firstDayOfMonth(new Date()));
    protected readonly selectedDate = signal(this.toIsoDate(new Date()));
    protected readonly expandedHour = signal<string | null>(null);
    protected readonly canCreate = () => this.authStore.hasPermission(PERMISSION_CODE.MASS_CREATE);
    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.MASS_EDIT);
    protected readonly canCloseSchedule = () => this.authStore.hasPermission(PERMISSION_CODE.MASS_CLOSE_SCHEDULE);
    protected readonly canReopenSchedule = () => this.authStore.hasPermission(PERMISSION_CODE.MASS_REOPEN_SCHEDULE);

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
        this.programStatus.set(null);
        this.syncUrl();
        this.load();
    }

    protected reload(): void { this.load(); }

    protected selectDay(day: CalendarDay): void {
        const parsed = this.parseIsoDate(day.date);
        const monthChanged = parsed.getMonth() !== this.month().getMonth() || parsed.getFullYear() !== this.month().getFullYear();
        this.selectedDate.set(day.date);
        this.expandedHour.set(null);
        this.programStatus.set(null);
        if (monthChanged) {
            this.month.set(this.firstDayOfMonth(parsed));
            this.load();
        }
        this.syncUrl();
    }

    protected toggleHour(hora: string): void {
        const opening = this.expandedHour() !== hora;
        this.expandedHour.set(opening ? hora : null);
        this.programStatus.set(null);
        this.syncUrl();
        if (opening) this.loadProgramStatus(hora);
    }

    protected closeProgram(group: CalendarHourGroup): void {
        if (!this.canCloseSchedule() || this.closingProgram()) return;

        const status = this.programStatus();
        if (!status || !status.puedeCerrar) {
            this.feedback.warning(status?.mensaje || 'La programación todavía no está lista para cerrarse.');
            return;
        }

        const ref = this.dialog.open(ConfirmActionDialog, {
            width: 'min(540px, calc(100vw - 2rem))',
            data: {
                title: `Cerrar programación de las ${group.hora}`,
                message: `Se cerrarán ${status.totalMisas} Misa(s) del ${this.selectedDateLabel()}. Después del cierre ya no podrán modificarse normalmente. ¿Confirma el cierre?`,
                cancelText: 'Cancelar',
                confirmText: 'Cerrar programación',
                icon: 'lock'
            }
        });

        ref.afterClosed().subscribe(confirmed => {
            if (!confirmed) return;
            this.closingProgram.set(true);
            this.api.closeProgram(this.selectedDate(), this.apiTime(group.hora)).pipe(finalize(() => this.closingProgram.set(false))).subscribe({
                next: response => {
                    this.feedback.success(response.mensaje);
                    this.load();
                },
                error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo cerrar la programación.'))
            });
        });
    }


    protected reopenProgram(group: CalendarHourGroup): void {
        const status = this.programStatus();
        if (!status || !status.puedeReabrir || status.programacionCelebrada || !this.canReopenSchedule() || this.reopeningProgram()) return;

        const ref = this.dialog.open(MisaReopenProgramDialog, {
            width: 'min(560px, calc(100vw - 2rem))',
            disableClose: true,
            data: {
                fechaLabel: this.selectedDateLabel(),
                hora: group.hora,
                versionActual: status.versionActual
            }
        });

        ref.afterClosed().subscribe(motivo => {
            if (!motivo) return;

            this.reopeningProgram.set(true);
            this.api.reopenProgram({
                fecha: this.selectedDate(),
                hora: this.apiTime(group.hora),
                motivo
            }).pipe(finalize(() => this.reopeningProgram.set(false))).subscribe({
                next: response => {
                    this.feedback.success(response.mensaje);
                    this.load();
                },
                error: error => this.feedback.error(getApiErrorMessage(error, 'No se pudo reabrir la programación.'))
            });
        });
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
        this.programStatus.set(null);
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
                if (requestedHour && !this.hourGroups().some(x => x.hora === requestedHour)) {
                    this.expandedHour.set(null);
                    this.programStatus.set(null);
                } else if (requestedHour) {
                    this.loadProgramStatus(requestedHour);
                }
            },
            error: error => {
                this.items.set([]);
                this.programStatus.set(null);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar el calendario de misas.'));
            }
        });
    }

    private loadProgramStatus(hora: string): void {
        this.loadingProgramStatus.set(true);
        this.api.getProgramStatus(this.selectedDate(), this.apiTime(hora)).pipe(finalize(() => this.loadingProgramStatus.set(false))).subscribe({
            next: status => this.programStatus.set(status),
            error: error => {
                this.programStatus.set(null);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo consultar el estado de la programación.'));
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

    private apiTime(hora: string): string { return /^\d{2}:\d{2}$/.test(hora) ? `${hora}:00` : hora; }
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
