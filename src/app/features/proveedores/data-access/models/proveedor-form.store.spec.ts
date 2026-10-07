import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProveedorApiService } from '../proveedor-api.service';
import { ProveedorFormStore } from './proveedor-form.store';

describe('ProveedorFormStore', () => {
    const detail = { idProveedor: 5, codProveedor: 'PRV2026-000005', razonSocial: 'Proveedor SAC', rowVersion: 'A' } as any;
    const apiMock = {
        getTiposDocumento: vi.fn(() => of([])), getById: vi.fn(() => of(detail)),
        create: vi.fn(() => of({ idProveedor: 5, codProveedor: 'PRV2026-000005', rowVersion: 'A', mensaje: 'Proveedor registrado correctamente.' })),
        update: vi.fn(() => of({ idProveedor: 5, codProveedor: 'PRV2026-000005', rowVersion: 'B', mensaje: 'Proveedor actualizado correctamente.' }))
    };
    let store: ProveedorFormStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [ProveedorFormStore, { provide: ProveedorApiService, useValue: apiMock }] });
        store = TestBed.inject(ProveedorFormStore);
    });

    it('should initialize create and edit modes', () => {
        store.initialize(null); expect(apiMock.getTiposDocumento).toHaveBeenCalledOnce(); expect(apiMock.getById).not.toHaveBeenCalled();
        store.initialize(5); expect(apiMock.getById).toHaveBeenCalledWith(5); expect(store.detail()?.codProveedor).toBe('PRV2026-000005');
    });

    it('should create and update supplier', () => {
        const create = { idTipoDocumento: null, numeroDocumento: null, razonSocial: 'Juan Perez', nombreComercial: null, telefono: null, email: null, direccion: null, observaciones: null };
        store.create(create); expect(apiMock.create).toHaveBeenCalledWith(create); expect(store.saveResult()?.idProveedor).toBe(5);
        store.clearSaveResult();
        store.update(5, { ...create, rowVersion: 'A' }); expect(apiMock.update).toHaveBeenCalledOnce();
    });
});
