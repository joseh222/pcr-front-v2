import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PersonaApiService } from '../persona-api.service';
import { PersonaFormStore } from './persona-form.store';

describe('PersonaFormStore', () => {
    const apiMock = {
        getTiposDocumento: vi.fn(() => of([])),
        getRoles: vi.fn(() => of([])),
        getById: vi.fn(() => of({
            idPersona: 5, codPersona: 'PER2026-000005', idTipoDocumento: 1, codigoTipoDocumento: 'DNI',
            nombreTipoDocumento: 'DNI', numeroDocumento: '12345678', nombreCompleto: 'JUAN PEREZ',
            fechaNacimiento: '1990-01-01', telefono: null, email: null, direccion: null, isActive: true,
            createdUtc: '2026-08-20T00:00:00Z', updatedUtc: null, roles: [], rowVersion: 'A'
        })),
        create: vi.fn(() => of({ idPersona: 5, codPersona: 'PER2026-000005', rowVersion: 'A', mensaje: 'OK' })),
        update: vi.fn(() => of({ idPersona: 5, codPersona: 'PER2026-000005', rowVersion: 'B', mensaje: 'OK' }))
    };

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({
            providers: [PersonaFormStore, { provide: PersonaApiService, useValue: apiMock }]
        });
    });

    it('should load catalogs for a new person', () => {
        const store = TestBed.inject(PersonaFormStore);
        store.initialize(null);
        expect(apiMock.getTiposDocumento).toHaveBeenCalledOnce();
        expect(apiMock.getRoles).toHaveBeenCalledOnce();
        expect(apiMock.getById).not.toHaveBeenCalled();
    });

    it('should load detail and update a person', () => {
        const store = TestBed.inject(PersonaFormStore);
        store.initialize(5);
        expect(store.detail()?.idPersona).toBe(5);
        store.update(5, {
            idTipoDocumento: 1, numeroDocumento: '12345678', nombreCompleto: 'JUAN PEREZ',
            fechaNacimiento: null, telefono: null, email: null, direccion: null, roles: [], rowVersion: 'A'
        });
        expect(apiMock.update).toHaveBeenCalledOnce();
        expect(store.saveResult()?.rowVersion).toBe('B');
    });
});
