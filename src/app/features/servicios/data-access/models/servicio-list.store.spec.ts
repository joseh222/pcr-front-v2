import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ServicioApiService } from '../servicio-api.service';
import { ServicioListStore } from './servicio-list.store';

describe('ServicioListStore', () => {
    const response = { items: [{ idServicio: 1, codigo: 'MISA' }], pageNumber: 1, pageSize: 20, totalRecords: 1, totalPages: 1 } as any;
    const apiMock = { getList: vi.fn(() => of(response)), getCategorias: vi.fn(() => of([])) };
    let store: ServicioListStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [ServicioListStore, { provide: ServicioApiService, useValue: apiMock }] });
        store = TestBed.inject(ServicioListStore);
    });

    it('should load active services by default', () => {
        store.load();
        expect(apiMock.getList).toHaveBeenCalledWith(expect.objectContaining({ isActive: true, pageNumber: 1, pageSize: 20 }));
        expect(store.totalRecords()).toBe(1); expect(store.items()[0].codigo).toBe('MISA');
    });

    it('should normalize filters and reset page', () => {
        store.changePage(2);
        store.search({ search: '  MISA  ', idCategoriaServicio: null, modoPrecio: 'FIJO', isActive: null });
        expect(store.query()).toEqual(expect.objectContaining({ search: 'MISA', modoPrecio: 'FIJO', isActive: null, pageNumber: 1 }));
    });

    it('should load categories once', () => {
        store.loadCatalogs(); store.loadCatalogs();
        expect(apiMock.getCategorias).toHaveBeenCalledOnce();
    });
});
