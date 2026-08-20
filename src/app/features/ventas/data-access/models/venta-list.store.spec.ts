import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { VentaApiService } from '../venta-api.service';
import { VentaListStore } from './venta-list.store';

describe('VentaListStore', () => {
    const response = {
        pagina: 1,
        tamanoPagina: 20,
        totalRegistros: 1,
        totalPaginas: 1,
        items: [
            { idVenta: 1, codVenta: 'V2026-00001' }
        ]
    };

    const apiMock = {
        getList: vi.fn(() => of(response as any)),
        getMetodosPago: vi.fn(() => of([])),
        getTiposComprobante: vi.fn(() => of([]))
    };

    let store: VentaListStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock =>
            mock.mockClear()
        );

        TestBed.configureTestingModule({
            providers: [
                VentaListStore,
                {
                    provide: VentaApiService,
                    useValue: apiMock
                }
            ]
        });

        store = TestBed.inject(VentaListStore);
    });

    it('should load sales', () => {
        store.load();

        expect(apiMock.getList).toHaveBeenCalledWith(
            expect.objectContaining({
                pagina: 1,
                tamanoPagina: 20
            })
        );

        expect(store.totalRegistros()).toBe(1);
        expect(store.items()[0].codVenta)
            .toBe('V2026-00001');
    });

    it('should normalize filters and reset page', () => {
        store.changePage(2);

        store.search({
            fechaInicio: null,
            fechaFin: null,
            idMetodoPago: null,
            idTipoComprobante: null,
            tipoItem: 'SERVICIO',
            texto: '  JOSE  '
        });

        expect(store.query()).toEqual(
            expect.objectContaining({
                pagina: 1,
                tipoItem: 'SERVICIO',
                texto: 'JOSE'
            })
        );
    });

    it('should load catalogs only once', () => {
        store.loadCatalogs();
        store.loadCatalogs();

        expect(apiMock.getMetodosPago)
            .toHaveBeenCalledOnce();

        expect(apiMock.getTiposComprobante)
            .toHaveBeenCalledOnce();
    });
});