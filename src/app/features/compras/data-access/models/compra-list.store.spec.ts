import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CompraApiService } from '../compra-api.service';
import { CompraListStore } from './compra-list.store';

describe('CompraListStore', () => {
    const apiMock = { searchProveedores: vi.fn(() => of([])),
        getEstados: vi.fn(() => of([{ idEstadoCompra: 1, codigo: 'REGISTRADA', nombre: 'Registrada', isActive: true }])),
        getTiposComprobante: vi.fn(() => of([])),
        getList: vi.fn(() => of({ pageNumber: 1, pageSize: 20, totalRows: 1, totalPages: 1, items: [{ idCompra: 1, codCompra: 'CMP2026-000001' }] }))
    };

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [CompraListStore, { provide: CompraApiService, useValue: apiMock }] });
    });

    it('should load catalogs and purchases', () => {
        const store = TestBed.inject(CompraListStore);
        store.loadCatalogs(); store.load();
        expect(apiMock.getEstados).toHaveBeenCalledOnce();
        expect(apiMock.getTiposComprobante).toHaveBeenCalledOnce();
        expect(apiMock.getList).toHaveBeenCalledWith({ search: null, idProveedor: null, idTipoComprobanteCompra: null, idEstadoCompra: null, fechaInicio: null, fechaFin: null, pageNumber: 1, pageSize: 20 });
        expect(store.totalRows()).toBe(1);
    });

    it('should normalize filters and reset pagination', () => {
        const store = TestBed.inject(CompraListStore);
        store.search({ search: '  CMP  ', idProveedor: 2, idTipoComprobanteCompra: 1, idEstadoCompra: 1, fechaInicio: '2026-08-01', fechaFin: '2026-08-31' });
        expect(apiMock.getList).toHaveBeenLastCalledWith({ search: 'CMP', idProveedor: 2, idTipoComprobanteCompra: 1, idEstadoCompra: 1, fechaInicio: '2026-08-01', fechaFin: '2026-08-31', pageNumber: 1, pageSize: 20 });
    });

    it('should search suppliers only with at least two characters', () => {
        const store = TestBed.inject(CompraListStore);
        store.searchProveedores('s'); expect(apiMock.searchProveedores).not.toHaveBeenCalled();
        store.searchProveedores('san'); expect(apiMock.searchProveedores).toHaveBeenCalledWith('san', 10);
    });
});
