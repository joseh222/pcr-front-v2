import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PersonaApiService } from '../persona-api.service';
import { PersonaDetailStore } from './persona-detail.store';

describe('PersonaDetailStore', () => {
    const apiMock = {
        getById: vi.fn(() => of({
            idPersona: 5, codPersona: 'PER2026-000005', idTipoDocumento: 1, codigoTipoDocumento: 'DNI',
            nombreTipoDocumento: 'DNI', numeroDocumento: '12345678', nombreCompleto: 'JUAN PEREZ',
            fechaNacimiento: '1990-01-01', telefono: null, email: null, direccion: null, isActive: true,
            createdUtc: '2026-08-20T00:00:00Z', updatedUtc: null, roles: [], rowVersion: 'A'
        }))
    };

    beforeEach(() => {
        apiMock.getById.mockClear();
        TestBed.configureTestingModule({
            providers: [PersonaDetailStore, { provide: PersonaApiService, useValue: apiMock }]
        });
    });

    it('should load person detail', () => {
        const store = TestBed.inject(PersonaDetailStore);
        store.load(5);
        expect(apiMock.getById).toHaveBeenCalledWith(5);
        expect(store.detail()?.nombreCompleto).toBe('JUAN PEREZ');
    });
});
