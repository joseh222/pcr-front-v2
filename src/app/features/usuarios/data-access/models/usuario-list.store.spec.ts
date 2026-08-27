import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { UsuarioApiService } from '../usuario-api.service';
import { UsuarioListStore } from './usuario-list.store';

describe('UsuarioListStore', () => {
    const apiMock = {
        getRoles: vi.fn(() => of([{ idRole: 2, code: 'SECRETARIA', name: 'Secretaría', isActive: true }])),
        getList: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 20, totalRecords: 0, totalPages: 0 }))
    };

    beforeEach(() => {
        apiMock.getRoles.mockClear(); apiMock.getList.mockClear();
        TestBed.configureTestingModule({ providers: [UsuarioListStore, { provide: UsuarioApiService, useValue: apiMock }] });
    });

    it('should load users and roles', () => {
        const store = TestBed.inject(UsuarioListStore);
        store.loadRoles(); store.load();
        expect(apiMock.getRoles).toHaveBeenCalledOnce(); expect(apiMock.getList).toHaveBeenCalledOnce();
    });

    it('should normalize filters and restart pagination', () => {
        const store = TestBed.inject(UsuarioListStore);
        store.search({ search: ' ADMIN ', idRole: 2, isActive: null });
        expect(apiMock.getList).toHaveBeenCalledWith(expect.objectContaining({ search: 'ADMIN', idRole: 2, isActive: null, pageNumber: 1 }));
    });
});
