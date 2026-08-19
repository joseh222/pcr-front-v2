import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MisaApiService } from '../misa-api.service';
import { MisaFormStore } from './misa-form.store';

describe('MisaFormStore', () => {
    let store: MisaFormStore;

    const getModalidadesMock = vi.fn();
    const getTiposMock = vi.fn();
    const getByIdMock = vi.fn();

    beforeEach(() => {
        getModalidadesMock.mockReset();
        getTiposMock.mockReset();
        getByIdMock.mockReset();

        getModalidadesMock.mockReturnValue(of([{ idModalidad: 1, nombre: 'Personal' }]));
        getTiposMock.mockReturnValue(of([{ idTipo: 2, codigo: 'DIFUNTO', nombre: 'Difunto' }]));

        TestBed.configureTestingModule({
            providers: [
                MisaFormStore,
                {
                    provide: MisaApiService,
                    useValue: { getModalidades: getModalidadesMock, getTipos: getTiposMock, getById: getByIdMock }
                }
            ]
        });

        store = TestBed.inject(MisaFormStore);
    });

    it('should initialize create mode without requesting a misa detail', () => {
        store.initialize(null);

        expect(getByIdMock).not.toHaveBeenCalled();
        expect(store.modalidades()).toHaveLength(1);
        expect(store.tipos()).toHaveLength(1);
        expect(store.detail()).toBeNull();
        expect(store.loading()).toBe(false);
    });

    it('should initialize edit mode with the misa detail', () => {
        getByIdMock.mockReturnValue(of({
            idMisa: 25,
            codMisa: 'M2026-00025',
            modalidad: { idModalidad: 1, nombre: 'Personal' },
            tipo: { idTipo: 2, codigo: 'DIFUNTO', nombre: 'Difunto' },
            solicitante: null,
            estado: null,
            santo: null,
            intenciones: [],
            fecha: '2026-08-30T00:00:00',
            hora: '18:00:00',
            fechaHora: '2026-08-30T18:00:00',
            observaciones: null,
            motivo: null,
            ofrecen: null,
            celular: null,
            devotos: null,
            solicitudServicio: null,
            puedeEditar: true,
            puedeEliminar: true,
            puedeCobrar: false
        }));

        store.initialize(25);

        expect(getByIdMock).toHaveBeenCalledWith(25);
        expect(store.detail()?.idMisa).toBe(25);
        expect(store.loading()).toBe(false);
    });
});