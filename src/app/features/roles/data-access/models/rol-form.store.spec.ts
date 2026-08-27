import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { RolApiService } from '../rol-api.service';
import { RolFormStore } from './rol-form.store';

describe('RolFormStore', () => {
    const permissions = [{ idPermiso: 1, codigo: 'MISA_VER', modulo: 'MISA', accion: 'VER', nombre: 'Ver misas', descripcion: null, orden: 1, isActive: true, isSystem: true }];
    const detail = { idRole: 4, code: 'SECRETARIA', name: 'Secretaría', description: null, isActive: true, isSystem: false, grantsAllPermissions: false, userCount: 0, permissionCount: 1, rowVersion: 'A' };
    const apiMock = {
        getPermissions: vi.fn(() => of(permissions)),
        getById: vi.fn(() => of(detail)),
        getRolePermissions: vi.fn(() => of([{ ...permissions[0], isAssigned: true }])),
        create: vi.fn(() => of({ idRole: 5, code: 'CAJA', name: 'Caja', rowVersion: 'A', mensaje: 'Creado' })),
        update: vi.fn(() => of({ idRole: 4, rowVersion: 'B', mensaje: 'Actualizado' })),
        updatePermissions: vi.fn((idRole: number) => of({ idRole, permissionCount: 1, rowVersion: 'C', mensaje: 'Permisos actualizados' }))
    };
    beforeEach(() => { Object.values(apiMock).forEach(mock => mock.mockClear()); TestBed.configureTestingModule({ providers: [RolFormStore, { provide: RolApiService, useValue: apiMock }] }); });
    it('should initialize create and edit modes', () => { const store = TestBed.inject(RolFormStore); store.initialize(null); expect(apiMock.getPermissions).toHaveBeenCalled(); store.initialize(4); expect(apiMock.getById).toHaveBeenCalledWith(4); expect(store.assignedPermissionIds()).toEqual([1]); });
    it('should create role and then save permissions', () => {
        const store = TestBed.inject(RolFormStore); store.create({ code: 'CAJA', name: 'Caja', description: null }, [1], true); expect(apiMock.create).toHaveBeenCalled();
        expect(apiMock.updatePermissions).toHaveBeenCalledWith(5, [1], 'A'); expect(store.saveResult()?.idRole).toBe(5);
    });
    it('should update custom role before its permissions', () => { const store = TestBed.inject(RolFormStore); store.initialize(4); store.update(4, 'Secretaría', null, [1], true, true); expect(apiMock.update).toHaveBeenCalledWith(4, { name: 'Secretaría', description: null, rowVersion: 'A' }); expect(apiMock.updatePermissions).toHaveBeenCalledWith(4, [1], 'B'); });

    it('should update only role data when permission assignment is not allowed', () => { const store = TestBed.inject(RolFormStore); store.initialize(4); store.update(4, 'Secretaría', null, [1], true, false); expect(apiMock.update).toHaveBeenCalled(); expect(apiMock.updatePermissions).not.toHaveBeenCalled(); });
});
