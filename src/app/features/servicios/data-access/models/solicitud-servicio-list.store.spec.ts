import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SolicitudServicioApiService } from '../solicitud-servicio-api.service';
import { SolicitudServicioListStore } from './solicitud-servicio-list.store';

describe('SolicitudServicioListStore', () => {
    const apiMock = {
        getList: vi.fn(() => of({
            items: [],
            pageNumber: 1,
            pageSize: 20,
            totalRecords: 0,
            totalPages: 0
        })),
        getEstados: vi.fn(() => of([{
            idEstadoSolicitudServicio: 1,
            codigo: 'ACTIVA',
            nombre: 'Activa'
        }])),
        getServicios: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 100, totalRecords: 0, totalPages: 0 })),
        getEstadosPago: vi.fn(() => of([{
            idEstadoPagoSolicitudServicio: 1,
            codigo: 'PENDIENTE',
            nombre: 'Pendiente'
        }]))
    };
    let store: SolicitudServicioListStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [SolicitudServicioListStore, { provide: SolicitudServicioApiService, useValue: apiMock }] });
        store = TestBed.inject(SolicitudServicioListStore);
    });

    it('should load catalogs and requests', () => {
        store.loadCatalogs(); store.load();
        expect(apiMock.getEstados).toHaveBeenCalledOnce();
        expect(apiMock.getEstadosPago).toHaveBeenCalledOnce();
        expect(apiMock.getServicios).toHaveBeenCalledOnce();
        expect(apiMock.getList).toHaveBeenCalledWith({
            search: null,
            idServicio: null,
            estadoSolicitud: null,
            estadoPago: null,
            requierePago: null,
            fechaInicio: null,
            fechaFin: null,
            pageNumber: 1,
            pageSize: 20
        });
        expect(apiMock.getList).toHaveBeenCalledOnce();
    });

    it('should normalize filters and restart pagination', () => {
        store.search({ search: '  jose  ', idServicio: 2, estadoSolicitud: 'ACTIVA', estadoPago: 'PENDIENTE', requierePago: true, fechaInicio: null, fechaFin: null });
        expect(apiMock.getList).toHaveBeenCalledWith(expect.objectContaining({ search: 'jose', idServicio: 2, pageNumber: 1 }));
    });
});
