import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SolicitudServicioCancellationService } from '../../data-access/solicitud-servicio-cancellation.service';
import { SolicitudServicioListStore } from '../../data-access/models/solicitud-servicio-list.store';
import { SolicitudServicioListPage } from './solicitud-servicio-list';

describe('SolicitudServicioListPage', () => {
    const items = signal<any[]>([]);
    const storeMock = {
        servicios: signal<any[]>([]).asReadonly(), estados: signal<any[]>([]).asReadonly(), estadosPago: signal<any[]>([]).asReadonly(), catalogsLoading: signal(false).asReadonly(), catalogsError: signal<string | null>(null).asReadonly(),
        loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), items: items.asReadonly(), pageNumber: signal(1).asReadonly(), pageSize: signal(20).asReadonly(), totalRecords: signal(0).asReadonly(), isEmpty: () => items().length === 0,
        loadCatalogs: vi.fn(), load: vi.fn(), reload: vi.fn(), search: vi.fn(), resetFilters: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn()
    };
    const cancellationMock = { cancel: vi.fn(() => of({ idSolicitudServicio: 10 })) };

    beforeEach(() => {
        items.set([]); Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); }); cancellationMock.cancel.mockClear();
        TestBed.configureTestingModule({ imports: [SolicitudServicioListPage], providers: [provideRouter([]), { provide: SolicitudServicioCancellationService, useValue: cancellationMock }] });
        TestBed.overrideComponent(SolicitudServicioListPage, { set: { providers: [{ provide: SolicitudServicioListStore, useValue: storeMock }] } });
    });

    it('should initialize requests and catalogs', () => {
        const fixture = TestBed.createComponent(SolicitudServicioListPage); fixture.detectChanges();
        expect(storeMock.loadCatalogs).toHaveBeenCalledOnce(); expect(storeMock.load).toHaveBeenCalledOnce(); expect(fixture.nativeElement.textContent).toContain('Servicios');
    });

    it('should reload after cancellation', () => {
        const fixture = TestBed.createComponent(SolicitudServicioListPage); fixture.detectChanges(); storeMock.reload.mockClear();
        const item = { idSolicitudServicio: 10, codSolicitudServicio: 'SS10', codigoServicio: 'CONSTANCIA', estadoSolicitud: 'ACTIVA', estadoPago: 'PENDIENTE', requierePago: true, rowVersion: 'A' } as any;
        fixture.componentInstance['cancel'](item); expect(cancellationMock.cancel).toHaveBeenCalledWith(item); expect(storeMock.reload).toHaveBeenCalledOnce();
    });
});
