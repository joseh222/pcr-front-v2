import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { ConstanciaApiService } from '../../../sacramentos/constancias/data-access/constancia-api.service';
import { SolicitudServicioCancellationService } from '../../data-access/solicitud-servicio-cancellation.service';
import { SolicitudServicioDetailStore } from '../../data-access/models/solicitud-servicio-detail.store';
import { SolicitudServicioDetailPage } from './solicitud-servicio-detail';

const DETAIL = { idSolicitudServicio: 10, codSolicitudServicio: 'SS2026-00010', codigoServicio: 'CONSTANCIA', nombreServicio: 'Constancia', modoPrecio: 'FIJO', idPersona: 1, nombreCompleto: 'José', numeroDocumento: '12345678', telefono: null, requierePago: true, cantidad: 1, importe: 20, importeTotal: 20, estadoSolicitud: 'ACTIVA', nombreEstadoSolicitud: 'Activa', estadoPago: 'PENDIENTE', nombreEstadoPago: 'Pendiente', createdUtc: '2026-08-20T12:00:00Z', observaciones: null, motivoNoPago: null, motivoAnulacion: null, anuladaUtc: null, requiereRegistroSacramental: true, tieneRegistroSacramental: true, rowVersion: 'A' } as any;
const authStoreMock = { hasPermission: vi.fn(() => true) };

describe('SolicitudServicioDetailPage', () => {
    const detail = signal<any>(DETAIL);
    const storeMock = { detail: detail.asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), load: vi.fn() };
    const cancellationMock = { cancel: vi.fn(() => of({ idSolicitudServicio: 10 })) };
    const constanciaApi = { getBySolicitud: vi.fn(() => of(null)), imprimir: vi.fn(() => of({ idTrabajo: 101, tipoDocumento: 'CONSTANCIA_SACRAMENTAL', estado: 'PENDIENTE', impresora: 'HP CONSTANCIAS', cantidadCopias: 1, codigo: 'QUEUED', mensaje: 'OK' })), getTrabajoEstado: vi.fn(() => of({ idTrabajo: 101, tipoDocumento: 'CONSTANCIA_SACRAMENTAL', entidadOrigen: 'SOLICITUD_SERVICIO', idOrigen: 10, codigoReferencia: 'SS2026-00010', numeroSolicitud: 1, modoImpresion: 'MANUAL', impresora: 'HP CONSTANCIAS', estado: 'COMPLETADO', intentos: 1, maxIntentos: 3, cantidadCopias: 1, fechaCreacionUtc: '', fechaActualizacionUtc: '', fechaFinalizacionUtc: '', ultimoDetalle: null, rowVersion: 'Z' })) };
    beforeEach(() => {
        detail.set(DETAIL); storeMock.load.mockClear(); cancellationMock.cancel.mockClear(); vi.clearAllMocks();
        TestBed.configureTestingModule({ imports: [SolicitudServicioDetailPage], providers: [{ provide: AuthStore, useValue: authStoreMock }, { provide: ConstanciaApiService, useValue: constanciaApi }, { provide: FeedbackService, useValue: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }, provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '10' }) } } }, { provide: SolicitudServicioCancellationService, useValue: cancellationMock }] });
        TestBed.overrideComponent(SolicitudServicioDetailPage, { set: { providers: [{ provide: SolicitudServicioDetailStore, useValue: storeMock }] } });
    });

    it('should load and render request detail', () => {
        const fixture = TestBed.createComponent(SolicitudServicioDetailPage); fixture.detectChanges();
        expect(storeMock.load).toHaveBeenCalledWith(10); expect(constanciaApi.getBySolicitud).toHaveBeenCalledWith(10); expect(fixture.nativeElement.textContent).toContain('SS2026-00010'); expect(fixture.nativeElement.textContent).toContain('Constancia');
    });

    it('should reload after cancellation', () => {
        const fixture = TestBed.createComponent(SolicitudServicioDetailPage); fixture.detectChanges(); storeMock.load.mockClear(); fixture.componentInstance['cancel']();
        expect(cancellationMock.cancel).toHaveBeenCalledWith(DETAIL); expect(storeMock.load).toHaveBeenCalledWith(10);
    });
});
