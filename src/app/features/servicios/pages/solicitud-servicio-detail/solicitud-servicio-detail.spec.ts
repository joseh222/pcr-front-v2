import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SolicitudServicioCancellationService } from '../../data-access/solicitud-servicio-cancellation.service';
import { SolicitudServicioDetailStore } from '../../data-access/models/solicitud-servicio-detail.store';
import { SolicitudServicioDetailPage } from './solicitud-servicio-detail';
import { AuthStore } from '../../../auth/data-access/auth.store';

const DETAIL = { idSolicitudServicio: 10, codSolicitudServicio: 'SS2026-00010', codigoServicio: 'CONSTANCIA', nombreServicio: 'Constancia', modoPrecio: 'FIJO', idPersona: 1, nombreCompleto: 'José', numeroDocumento: '12345678', telefono: null, requierePago: true, importe: 20, estadoSolicitud: 'ACTIVA', nombreEstadoSolicitud: 'Activa', estadoPago: 'PENDIENTE', nombreEstadoPago: 'Pendiente', createdUtc: '2026-08-20T12:00:00Z', observaciones: null, motivoNoPago: null, motivoAnulacion: null, anuladaUtc: null, rowVersion: 'A' } as any;

const authStoreMock = { hasPermission: vi.fn(() => true) };

describe('SolicitudServicioDetailPage', () => {
    const detail = signal<any>(DETAIL);
    const storeMock = { detail: detail.asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), load: vi.fn() };
    const cancellationMock = { cancel: vi.fn(() => of({ idSolicitudServicio: 10 })) };
    beforeEach(() => {
        detail.set(DETAIL); storeMock.load.mockClear(); cancellationMock.cancel.mockClear();
        TestBed.configureTestingModule({ imports: [SolicitudServicioDetailPage], providers: [{ provide: AuthStore, useValue: authStoreMock }, provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '10' }) } } }, { provide: SolicitudServicioCancellationService, useValue: cancellationMock }] });
        TestBed.overrideComponent(SolicitudServicioDetailPage, { set: { providers: [{ provide: SolicitudServicioDetailStore, useValue: storeMock }] } });
    });

    it('should load and render request detail', () => {
        const fixture = TestBed.createComponent(SolicitudServicioDetailPage); fixture.detectChanges();
        expect(storeMock.load).toHaveBeenCalledWith(10); expect(fixture.nativeElement.textContent).toContain('SS2026-00010'); expect(fixture.nativeElement.textContent).toContain('Constancia');
    });

    it('should reload after cancellation', () => {
        const fixture = TestBed.createComponent(SolicitudServicioDetailPage); fixture.detectChanges(); storeMock.load.mockClear(); fixture.componentInstance['cancel']();
        expect(cancellationMock.cancel).toHaveBeenCalledWith(DETAIL); expect(storeMock.load).toHaveBeenCalledWith(10);
    });
});
