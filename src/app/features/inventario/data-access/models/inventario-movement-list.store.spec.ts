import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InventarioApiService } from '../inventario-api.service';
import { InventarioMovementListStore } from './inventario-movement-list.store';

describe('InventarioMovementListStore', () => {
    const apiMock = { getMovimientos: vi.fn(() => of({ items: [{ idMovimiento: 1, nombreTipoMovimiento: 'Venta' }], pageNumber: 1, pageSize: 20, totalRecords: 1, totalPages: 1 })) };
    let store: InventarioMovementListStore;
    beforeEach(() => { apiMock.getMovimientos.mockClear(); TestBed.configureTestingModule({ providers: [InventarioMovementListStore, { provide: InventarioApiService, useValue: apiMock }] }); store = TestBed.inject(InventarioMovementListStore); });
    it('should load filtered movements', () => {
        store.search({ idProducto: 5, idTipoMovimiento: null, fechaInicio: null, fechaFin: null });
        expect(apiMock.getMovimientos).toHaveBeenCalledWith(expect.objectContaining({ idProducto: 5, pageNumber: 1, pageSize: 20 }));
        expect(store.totalRecords()).toBe(1);
    });
});
