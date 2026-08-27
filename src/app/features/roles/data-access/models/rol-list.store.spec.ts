import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { RolApiService } from '../rol-api.service';
import { RolListStore } from './rol-list.store';

describe('RolListStore', () => {
    const roles = [
        { idRole: 1, code: 'ADMIN', name: 'Administrador', description: null, isActive: true, isSystem: true, grantsAllPermissions: true },
        { idRole: 4, code: 'SECRETARIA', name: 'Secretaría', description: 'Operativo', isActive: false, isSystem: false, grantsAllPermissions: false }
    ];
    const apiMock = { getRoles: vi.fn(() => of(roles)) };
    beforeEach(() => { apiMock.getRoles.mockClear(); TestBed.configureTestingModule({ providers: [RolListStore, { provide: RolApiService, useValue: apiMock }] }); });
    it('should load every role including inactive', () => { const store = TestBed.inject(RolListStore); store.load(); expect(apiMock.getRoles).toHaveBeenCalledWith(false); expect(store.totalRecords()).toBe(2); });
    it('should filter roles locally', () => { const store = TestBed.inject(RolListStore); store.load(); store.search({ search: 'secret', isActive: false }); expect(store.items().map(x => x.code)).toEqual(['SECRETARIA']); });
});
