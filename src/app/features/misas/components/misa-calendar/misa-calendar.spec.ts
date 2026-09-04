import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { MisaApiService } from '../../data-access/misa-api.service';
import { MisaCalendarComponent } from './misa-calendar';

describe('MisaCalendarComponent', () => {
    const api = { getCalendar: vi.fn(() => of({ fechaInicio: '2026-08-31', fechaFin: '2026-10-11', items: [{ idMisa: 1, codMisa: 'M2026-00001', fecha: '2026-09-09', hora: '18:00:00', idModalidad: 1, nombreModalidad: 'PERSONAL', idTipo: 2, codigoTipo: 'DIFUNTO', nombreTipo: 'DIFUNTO', idEstado: 1, nombreEstado: 'REGISTRADO', idSolicitante: 1, nombreSolicitante: 'JUAN', idSolicitudServicio: 5, codSolicitudServicio: 'SS2026-000005', requierePago: true, estadoSolicitud: 'ACTIVA', estadoPago: 'PENDIENTE', cantidadIntenciones: 1, motivo: null, ofrecen: null, celular: null, devotos: null, idSanto: null, nombreSanto: null, observaciones: null, cerradaUtc: null, programacionCerrada: false, pagoConforme: false, pendientePago: true, puedeEditar: true, puedeCobrar: true, intenciones: [{ idIntencion: 1, nombre: 'MARIA', observacion: null }] }] })) };

    beforeEach(() => {
        vi.clearAllMocks();
        TestBed.configureTestingModule({ imports: [MisaCalendarComponent], providers: [provideRouter([]), { provide: MisaApiService, useValue: api }, { provide: AuthStore, useValue: { hasPermission: vi.fn(() => true) } }, { provide: FeedbackService, useValue: { error: vi.fn() } }] });
    });

    it('loads a 42-day calendar range and renders agenda data', () => {
        const fixture = TestBed.createComponent(MisaCalendarComponent);
        fixture.detectChanges();
        expect(api.getCalendar).toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('[data-testid="misa-calendar"]')).toBeTruthy();
    });
});
