import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PersonaApiService } from '../../../personas/data-access/persona-api.service';
import { ServicioApiService } from '../servicio-api.service';
import { SolicitudServicioApiService } from '../solicitud-servicio-api.service';
import { SolicitudServicioFormStore } from './solicitud-servicio-form.store';

describe('SolicitudServicioFormStore', () => {
    const apiMock = { getById: vi.fn(() => of(null)), create: vi.fn(() => of({ idSolicitudServicio: 10 } as any)), update: vi.fn(() => of({ idSolicitudServicio: 10 } as any)) };
    const servicioMock = {
        search: vi.fn(() => of([
            { idServicio: 1, codigo: 'MISA', nombre: 'Misa' },
            { idServicio: 2, codigo: 'CONSTANCIA', nombre: 'Constancia' }
        ] as any)),
        getById: vi.fn(() => of({ idServicio: 2, codigo: 'CONSTANCIA', modoPrecio: 'FIJO', precioBase: 20 } as any))
    };
    const personaMock = {
        getTiposDocumento: vi.fn(() => of([])), search: vi.fn(() => of([])), getByDocument: vi.fn(() => of(null)),
        create: vi.fn(() => of({ idPersona: 3, codPersona: 'PER-3', rowVersion: 'A', mensaje: 'OK' }))
    };
    let store: SolicitudServicioFormStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear()); Object.values(servicioMock).forEach(mock => mock.mockClear()); Object.values(personaMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [SolicitudServicioFormStore, { provide: SolicitudServicioApiService, useValue: apiMock }, { provide: ServicioApiService, useValue: servicioMock }, { provide: PersonaApiService, useValue: personaMock }] });
        store = TestBed.inject(SolicitudServicioFormStore);
    });

    it('should initialize a new request', () => {
        store.initialize(null); expect(personaMock.getTiposDocumento).toHaveBeenCalledOnce(); expect(store.loading()).toBe(false);
    });

    it('should exclude Misa from generic service search', () => {
        store.searchServices('mi'); expect(store.serviceResults().map(x => x.codigo)).toEqual(['CONSTANCIA']);
    });

    it('should create a request', () => {
        const request = { idServicio: 2, idPersona: null, requierePago: true, importe: null, motivoNoPago: null, observaciones: null };
        store.create(request); expect(apiMock.create).toHaveBeenCalledWith(request); expect(store.saving()).toBe(false);
    });
});
