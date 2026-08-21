import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProductoApiService } from '../producto-api.service';
import { ProductoListStore } from './producto-list.store';

describe('ProductoListStore', () => {
    const response = { items: [{ idProducto: 1, codProducto: 'P2026-00000001' }], pageNumber: 1, pageSize: 20, totalRecords: 1, totalPages: 1 } as any;
    const apiMock = { getList: vi.fn(() => of(response)), getCategorias: vi.fn(() => of([])), getMarcas: vi.fn(() => of([])) };
    let store: ProductoListStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [ProductoListStore, { provide: ProductoApiService, useValue: apiMock }] });
        store = TestBed.inject(ProductoListStore);
    });

    it('should load active products by default', () => {
        store.load();
        expect(apiMock.getList).toHaveBeenCalledWith(expect.objectContaining({ isActive: true, pageNumber: 1, pageSize: 20 }));
        expect(store.totalRecords()).toBe(1); expect(store.items()[0].codProducto).toBe('P2026-00000001');
    });

    it('should normalize filters and reset page', () => {
        store.changePage(2);
        store.search({ search: '  VELA  ', idCategoriaProducto: null, idMarcaProducto: null, isActive: null });
        expect(store.query()).toEqual(expect.objectContaining({ search: 'VELA', isActive: null, pageNumber: 1 }));
    });

    it('should load catalogs once', () => {
        store.loadCatalogs(); store.loadCatalogs();
        expect(apiMock.getCategorias).toHaveBeenCalledOnce(); expect(apiMock.getMarcas).toHaveBeenCalledOnce();
    });
});
