import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PersonaApiService } from '../persona-api.service';
import { PersonaListStore } from './persona-list.store';

describe('PersonaListStore', () => {
    const response = { items: [{ idPersona: 1, codPersona: 'PER2026-000001' }], pageNumber: 1, pageSize: 20, totalRecords: 1, totalPages: 1 } as any;
    const apiMock = { getList: vi.fn(() => of(response)), getTiposDocumento: vi.fn(() => of([])), getRoles: vi.fn(() => of([])) };
    let store: PersonaListStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [PersonaListStore, { provide: PersonaApiService, useValue: apiMock }] });
        store = TestBed.inject(PersonaListStore);
    });

    it('should load active persons by default', () => {
        store.load();
        expect(apiMock.getList).toHaveBeenCalledWith(expect.objectContaining({ isActive: true, pageNumber: 1, pageSize: 20 }));
        expect(store.totalRecords()).toBe(1); expect(store.items()[0].codPersona).toBe('PER2026-000001');
    });

    it('should normalize filters and reset page', () => {
        store.changePage(2);
        store.search({ search: '  JOSE  ', idTipoDocumento: null, idRolPersona: 7, isActive: null });
        expect(store.query()).toEqual(expect.objectContaining({ search: 'JOSE', idRolPersona: 7, isActive: null, pageNumber: 1 }));
    });

    it('should load person catalogs once', () => {
        store.loadCatalogs(); store.loadCatalogs();
        expect(apiMock.getTiposDocumento).toHaveBeenCalledOnce(); expect(apiMock.getRoles).toHaveBeenCalledOnce();
    });
});
