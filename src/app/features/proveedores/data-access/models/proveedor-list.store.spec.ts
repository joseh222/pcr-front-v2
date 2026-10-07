import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProveedorApiService } from '../proveedor-api.service';
import { ProveedorListStore } from './proveedor-list.store';

describe('ProveedorListStore', () => {
    const response = { items: [{ idProveedor: 1, codProveedor: 'PRV2026-000001' }], pageNumber: 1, pageSize: 20, totalRecords: 1, totalPages: 1 } as any;
    const apiMock = { getList: vi.fn(() => of(response)), getTiposDocumento: vi.fn(() => of([])) };
    let store: ProveedorListStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [ProveedorListStore, { provide: ProveedorApiService, useValue: apiMock }] });
        store = TestBed.inject(ProveedorListStore);
    });

    it('should load active suppliers by default', () => {
        store.load();
        expect(apiMock.getList).toHaveBeenCalledWith(expect.objectContaining({ isActive: true, pageNumber: 1, pageSize: 20 }));
        expect(store.totalRecords()).toBe(1);
    });

    it('should normalize filters', () => {
        store.search({ search: '  SAN  ', idTipoDocumento: 3, isActive: null });
        expect(store.query()).toEqual(expect.objectContaining({ search: 'SAN', idTipoDocumento: 3, isActive: null, pageNumber: 1 }));
    });

    it('should load document types once', () => {
        store.loadCatalogs(); store.loadCatalogs();
        expect(apiMock.getTiposDocumento).toHaveBeenCalledOnce();
    });
});
