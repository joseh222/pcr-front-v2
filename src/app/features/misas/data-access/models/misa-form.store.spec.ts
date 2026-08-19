import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MisaApiService } from '../misa-api.service';
import { MisaFormStore } from './misa-form.store';
import { PersonaApiService } from '../../../personas/data-access/persona-api.service';

describe('MisaFormStore', () => {
    let store: MisaFormStore;

    const getModalidadesMock = vi.fn();
    const getTiposMock = vi.fn();
    const getByIdMock = vi.fn();
    const getTiposDocumentoMock = vi.fn();
    const getByDocumentMock = vi.fn();

    beforeEach(() => {
        getModalidadesMock.mockReset();
        getTiposMock.mockReset();
        getByIdMock.mockReset();
        getTiposDocumentoMock.mockReset();
        getByDocumentMock.mockReset();
        getTiposDocumentoMock.mockReturnValue(of([{ idTipoDocumento: 1, codigo: 'DNI', nombre: 'DNI', longitudMinima: 8, longitudMaxima: 8, soloNumeros: true, isActive: true }]));

        getModalidadesMock.mockReturnValue(of([{ idModalidad: 1, nombre: 'Personal' }]));
        getTiposMock.mockReturnValue(of([{ idTipo: 2, codigo: 'DIFUNTO', nombre: 'Difunto' }]));

        TestBed.configureTestingModule({
            providers: [
                MisaFormStore,
                {
                    provide: MisaApiService,
                    useValue: { getModalidades: getModalidadesMock, getTipos: getTiposMock, getById: getByIdMock }
                },
                { provide: PersonaApiService, useValue: { getTiposDocumento: getTiposDocumentoMock, getByDocument: getByDocumentMock } }
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

    it('should load document types during initialization', () => {
        store.initialize(null);
        expect(getTiposDocumentoMock).toHaveBeenCalledOnce();
        expect(store.tiposDocumento()).toHaveLength(1);
    });

    it('should find an existing person by document', () => {
        getByDocumentMock.mockReturnValue(of({
            idPersona: 10, codPersona: 'PER-10', idTipoDocumento: 1, codigoTipoDocumento: 'DNI', nombreTipoDocumento: 'DNI',
            numeroDocumento: '12345678', nombreCompleto: 'JOSE HUAMAN', fechaNacimiento: null, telefono: '999999999',
            email: null, direccion: null, isActive: true, rowVersion: 'abc'
        }));

        store.findPersonByDocument(1, '12345678');

        expect(getByDocumentMock).toHaveBeenCalledWith(1, '12345678');
        expect(store.documentLookupState()).toBe('found');
        expect(store.documentPerson()?.idPersona).toBe(10);
    });

    it('should allow a new person when document does not exist', () => {
        getByDocumentMock.mockReturnValue(of(null));
        store.findPersonByDocument(1, '12345678');
        expect(store.documentPerson()).toBeNull();
        expect(store.documentLookupState()).toBe('not-found');
    });
});