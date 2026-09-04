import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { SolicitudServicioFormStore } from '../../data-access/models/solicitud-servicio-form.store';
import { SolicitudServicioApiService } from '../../data-access/solicitud-servicio-api.service';
import { SolicitudServicioFormPage } from './solicitud-servicio-form';
import { AuthStore } from '../../../auth/data-access/auth.store';

const authStoreMock = { hasPermission: vi.fn(() => true) };

describe('SolicitudServicioFormPage', () => {
    const storeMock = {
        detail: signal<any>(null).asReadonly(), serviceDetail: signal<any>(null).asReadonly(), tiposDocumento: signal<any[]>([]).asReadonly(), serviceResults: signal<any[]>([]).asReadonly(), personResults: signal<any[]>([]).asReadonly(), createdPerson: signal<any>(null).asReadonly(),
        loading: signal(false).asReadonly(), saving: signal(false).asReadonly(), searchingServices: signal(false).asReadonly(), searchingPersons: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), saveError: signal<string | null>(null).asReadonly(), personError: signal<string | null>(null).asReadonly(), saveResult: signal<any>(null).asReadonly(),
        initialize: vi.fn(), searchServices: vi.fn(), clearServiceSearch: vi.fn(), searchPersons: vi.fn(), clearPersonSearch: vi.fn(), createPerson: vi.fn(), clearCreatedPerson: vi.fn(), create: vi.fn(), update: vi.fn(), clearSaveResult: vi.fn()
    };
    const feedbackMock = { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() };
    const dialogMock = { open: vi.fn(() => ({ afterClosed: () => EMPTY })) };
    const apiMock = { setRegistroSacramental: vi.fn(() => EMPTY) };

    beforeEach(() => {
        Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        TestBed.configureTestingModule({ imports: [SolicitudServicioFormPage], providers: [{ provide: AuthStore, useValue: authStoreMock }, provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } }, { provide: FeedbackService, useValue: feedbackMock }, { provide: MatDialog, useValue: dialogMock }, { provide: SolicitudServicioApiService, useValue: apiMock }] });
        TestBed.overrideComponent(SolicitudServicioFormPage, { set: { providers: [{ provide: SolicitudServicioFormStore, useValue: storeMock }] } });
    });

    it('should initialize a new request', () => {
        const fixture = TestBed.createComponent(SolicitudServicioFormPage); fixture.detectChanges();
        expect(storeMock.initialize).toHaveBeenCalledWith(null); expect(fixture.nativeElement.textContent).toContain('Nueva solicitud');
    });

    it('should select a generic service', () => {
        const fixture = TestBed.createComponent(SolicitudServicioFormPage); fixture.detectChanges();
        const service = { idServicio: 2, codigo: 'CONSTANCIA', nombre: 'Constancia', nombreCategoria: 'Documentos', modoPrecio: 'FIJO', precioBase: 20 } as any;
        fixture.componentInstance['selectService'](service);
        expect(fixture.componentInstance['form'].controls.idServicio.value).toBe(2); expect(fixture.componentInstance['selectedService']()?.codigo).toBe('CONSTANCIA');
    });
});
