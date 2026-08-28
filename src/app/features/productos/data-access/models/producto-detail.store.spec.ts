import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { InventarioApiService } from '../../../inventario/data-access/inventario-api.service';
import { ProductoApiService } from '../producto-api.service';
import { ProductoDetailStore } from './producto-detail.store';

describe('ProductoDetailStore', () => {
    const productoApiMock = { getById: vi.fn(() => of({ idProducto: 5, codProducto: 'P2026-00000005', nombre: 'Vela' } as any)) };
    const inventarioApiMock = { getByProducto: vi.fn(() => of({ idProducto: 5, stockActual: 10, fechaUltimoMovimiento: null } as any)) };
    let store: ProductoDetailStore;

    beforeEach(() => {
        productoApiMock.getById.mockClear(); inventarioApiMock.getByProducto.mockClear();
        TestBed.configureTestingModule({ providers: [ProductoDetailStore, { provide: ProductoApiService, useValue: productoApiMock }, { provide: InventarioApiService, useValue: inventarioApiMock }] });
        store = TestBed.inject(ProductoDetailStore);
    });

    it('should load product and inventory', () => {
        store.load(5);
        expect(productoApiMock.getById).toHaveBeenCalledWith(5);
        expect(inventarioApiMock.getByProducto).toHaveBeenCalledWith(5);
        expect(store.detail()?.codProducto).toBe('P2026-00000005');
        expect(store.inventory()?.stockActual).toBe(10);
    });

    it('should load product without inventory when access is not available', () => {
        store.load(5, false);
        expect(productoApiMock.getById).toHaveBeenCalledWith(5); expect(inventarioApiMock.getByProducto).not.toHaveBeenCalled(); expect(store.detail()?.idProducto).toBe(5);
    });
});
