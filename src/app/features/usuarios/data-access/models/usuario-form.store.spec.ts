import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { UsuarioApiService } from '../usuario-api.service';
import { UsuarioFormStore } from './usuario-form.store';

describe('UsuarioFormStore', () => {
    const roles = [{ idRole: 2, code: 'SECRETARIA', name: 'Secretaría', description: null, isActive: true, isSystem: false, grantsAllPermissions: false }];
    const detail = { idUser: 10, username: 'jose', roles, rowVersion: 'rv' };
    const apiMock = {
        getRoles: vi.fn(() => of(roles)),
        getById: vi.fn(() => of(detail)),
        create: vi.fn(() => of({ idUser: 10, username: 'jose', temporaryPassword: 'Temp123!', mustChangePassword: true, rowVersion: 'rv', mensaje: 'OK' })),
        update: vi.fn(() => of({ idUser: 10, rowVersion: 'rv2', roleChanged: false, sessionsRevoked: 0, mensaje: 'OK' }))
    };

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [UsuarioFormStore, { provide: UsuarioApiService, useValue: apiMock }] });
    });

    it('should initialize create and edit modes', () => {
        const store = TestBed.inject(UsuarioFormStore);
        store.initialize(null); expect(apiMock.getRoles).toHaveBeenCalledOnce();
        store.initialize(10); expect(apiMock.getById).toHaveBeenCalledWith(10);
    });

    it('should save a new user', () => {
        const store = TestBed.inject(UsuarioFormStore);
        store.create({ username: 'jose', email: null, nombreCompleto: 'Jose Huaman', idPersona: null, roles: [2] });
        expect(apiMock.create).toHaveBeenCalledOnce(); expect(store.saveResult()).not.toBeNull();
    });
});
