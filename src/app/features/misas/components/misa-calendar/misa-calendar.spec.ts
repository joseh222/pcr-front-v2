import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { MisaApiService } from '../../data-access/misa-api.service';
import { MisaCalendarComponent } from './misa-calendar';

describe('MisaCalendarComponent', () => {
    const calendarResponse = {
        fechaInicio: '2026-08-31',
        fechaFin: '2026-10-11',
        items: [{
            idMisa: 1, codMisa: 'M2026-00001', fecha: '2026-09-09', hora: '18:00:00',
            idModalidad: 1, nombreModalidad: 'PERSONAL', idTipo: 2, codigoTipo: 'DIFUNTO',
            nombreTipo: 'DIFUNTO', idEstado: 1, nombreEstado: 'REGISTRADO', idSolicitante: 1,
            nombreSolicitante: 'JUAN', idSolicitudServicio: 5, codSolicitudServicio: 'SS2026-000005',
            requierePago: true, estadoSolicitud: 'ACTIVA', estadoPago: 'PENDIENTE', cantidadIntenciones: 1,
            motivo: null, ofrecen: null, celular: null, devotos: null, idSanto: null, nombreSanto: null,
            observaciones: null, cerradaUtc: null, programacionCerrada: false, pagoConforme: false,
            pendientePago: true, puedeEditar: true, puedeCobrar: true,
            intenciones: [{ idIntencion: 1, nombre: 'MARIA', observacion: null }]
        }]
    };

    const api = {
        getCalendar: vi.fn(() => of(calendarResponse)),
        getProgramStatus: vi.fn(() => of({
            idProgramacion: 1, fecha: '2026-09-09', hora: '18:00:00', estadoProgramacion: 'ABIERTA', versionActual: 0,
            totalMisas: 1, totalPersonales: 1, totalComunitarias: 0, totalConformes: 0, totalPendientesPago: 1,
            totalSolicitudInvalida: 0, totalPagoInvalido: 0, programacionCerrada: false, programacionCelebrada: false,
            puedeCerrar: false, puedeReabrir: false, ultimaReaperturaUtc: null, motivoUltimaReapertura: null, codigo: 'PENDING_PAYMENT',
            mensaje: 'Existe una Misa pendiente de pago.',
            pendientes: [{ idMisa: 1, codMisa: 'M2026-00001', modalidad: 'PERSONAL', tipoMisa: 'DIFUNTO',
                idSolicitudServicio: 5, codSolicitudServicio: 'SS2026-000005', requierePago: true,
                estadoSolicitud: 'ACTIVA', estadoPago: 'PENDIENTE', motivoBloqueo: 'Pendiente de pago.' }]
        })),
        closeProgram: vi.fn(() => of({ fecha: '2026-09-09', hora: '18:00:00', cantidadMisas: 1, estado: 'CERRADA', mensaje: 'Programación cerrada correctamente.' })),
        reopenProgram: vi.fn(() => of({ fecha: '2026-09-09', hora: '18:00:00', cantidadMisas: 1, estado: 'ABIERTA', versionActual: 1, mensaje: 'Programación reabierta correctamente.' }))
    };

    const authStore = { hasPermission: vi.fn(() => true) };
    const feedback = { error: vi.fn(), warning: vi.fn(), success: vi.fn() };
    const dialog = { open: vi.fn(() => ({ afterClosed: () => of(true) })) };

    beforeEach(() => {
        vi.clearAllMocks();
        authStore.hasPermission.mockReturnValue(true);
        TestBed.configureTestingModule({
            imports: [MisaCalendarComponent],
            providers: [
                provideRouter([]),
                { provide: MisaApiService, useValue: api },
                { provide: AuthStore, useValue: authStore },
                { provide: FeedbackService, useValue: feedback },
                { provide: MatDialog, useValue: dialog }
            ]
        });
    });

    it('loads the calendar workspace', () => {
        const fixture = TestBed.createComponent(MisaCalendarComponent);
        fixture.detectChanges();
        expect(api.getCalendar).toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('[data-testid="misa-calendar"]')).toBeTruthy();
    });

    it('loads exact program status when an hour is expanded', () => {
        const fixture = TestBed.createComponent(MisaCalendarComponent);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.selectedDate.set('2026-09-09');
        component.toggleHour('18:00');
        expect(api.getProgramStatus).toHaveBeenCalledWith('2026-09-09', '18:00:00');
    });

    it('does not close when the program is blocked', () => {
        const fixture = TestBed.createComponent(MisaCalendarComponent);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.programStatus.set({ puedeCerrar: false, mensaje: 'Pendiente de pago.' });
        component.closeProgram({ hora: '18:00' });
        expect(api.closeProgram).not.toHaveBeenCalled();
        expect(feedback.warning).toHaveBeenCalled();
    });

    it('reopens a closed program from a modal without navigating away', () => {
        const fixture = TestBed.createComponent(MisaCalendarComponent);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.selectedDate.set('2026-09-09');
        component.programStatus.set({
            idProgramacion: 1, fecha: '2026-09-09', hora: '18:00:00', estadoProgramacion: 'CERRADA', versionActual: 1,
            totalMisas: 1, totalPersonales: 1, totalComunitarias: 0, totalConformes: 1, totalPendientesPago: 0,
            totalSolicitudInvalida: 0, totalPagoInvalido: 0, programacionCerrada: true, programacionCelebrada: false,
            puedeCerrar: false, puedeReabrir: true, ultimaReaperturaUtc: null, motivoUltimaReapertura: null,
            codigo: 'ALREADY_CLOSED', mensaje: 'Cerrada', pendientes: []
        });
        dialog.open.mockReturnValueOnce({ afterClosed: () => of('Misa adicional del sacerdote') });

        component.reopenProgram({ hora: '18:00' });

        expect(api.reopenProgram).toHaveBeenCalledWith({
            fecha: '2026-09-09',
            hora: '18:00:00',
            motivo: 'Misa adicional del sacerdote'
        });
        expect(feedback.success).toHaveBeenCalled();
    });

});
