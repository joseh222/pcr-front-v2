import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ServicioApiService } from '../servicio-api.service';
import { ServicioFormStore } from './servicio-form.store';

describe('ServicioFormStore', () => {
    const detail = { idServicio: 5, codigo: 'CONSTANCIA', nombre: 'Constancia', rowVersion: 'AAAAAAAABQ=' } as any;
    const apiMock = {
        getCategorias: vi.fn(() => of([])), getTiposSacramento: vi.fn(() => of([])), getById: vi.fn(() => of(detail)),
        create: vi.fn(() => of({ idServicio: 5, codigo: 'CONSTANCIA', rowVersion: 'A', mensaje: 'Servicio registrado correctamente.' })),
        update: vi.fn(() => of({ idServicio: 5, codigo: 'CONSTANCIA', rowVersion: 'B', mensaje: 'Servicio actualizado correctamente.' }))
    };
    let store: ServicioFormStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [ServicioFormStore, { provide: ServicioApiService, useValue: apiMock }] });
        store = TestBed.inject(ServicioFormStore);
    });

    it('should initialize create mode with categories', () => {
        store.initialize(null); expect(apiMock.getCategorias).toHaveBeenCalledOnce(); expect(apiMock.getTiposSacramento).toHaveBeenCalledOnce(); expect(apiMock.getById).not.toHaveBeenCalled();
    });

    it('should initialize edit mode with detail', () => {
        store.initialize(5); expect(apiMock.getById).toHaveBeenCalledWith(5); expect(store.detail()?.codigo).toBe('CONSTANCIA');
    });

    it('should create and update a service', () => {
        const create = { codigo: 'CONSTANCIA', idCategoriaServicio: 1, nombre: 'Constancia', descripcion: null, modoPrecio: 'FIJO' as const, precioBase: 15, idTipoSacramentoRequerido: null };
        store.create(create); expect(apiMock.create).toHaveBeenCalledWith(create); expect(store.saveResult()?.idServicio).toBe(5);
        store.clearSaveResult();
        store.update(5, { idCategoriaServicio: 1, nombre: 'Constancia', descripcion: null, modoPrecio: 'VARIABLE', precioBase: null, idTipoSacramentoRequerido: null, actualizarTipoSacramento: true, rowVersion: 'AAAAAAAABQ=' });
        expect(apiMock.update).toHaveBeenCalledOnce();
    });
});
