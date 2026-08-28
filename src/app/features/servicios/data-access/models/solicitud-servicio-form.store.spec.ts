import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SolicitudServicioApiService } from '../solicitud-servicio-api.service';
import { SolicitudServicioFormStore } from './solicitud-servicio-form.store';

describe('SolicitudServicioFormStore', () => {
    const apiMock = {
        getById: vi.fn(() => of(null)), getPersonaTiposDocumento: vi.fn(() => of([])), getPersonaByDocument: vi.fn(() => of(null)), searchPersonas: vi.fn(() => of([])),
        searchServicios: vi.fn(() => of([{ idServicio: 1, codigo: 'MISA', nombre: 'Misa' }, { idServicio: 2, codigo: 'CONSTANCIA', nombre: 'Constancia' }] as any)),
        getServicioById: vi.fn(() => of({ idServicio: 2, codigo: 'CONSTANCIA', modoPrecio: 'FIJO', precioBase: 20 } as any)),
        create: vi.fn(() => of({ idSolicitudServicio: 10 } as any)), update: vi.fn(() => of({ idSolicitudServicio: 10 } as any)),
        createPersona: vi.fn(() => of({ idPersona: 3, codPersona: 'PER-3', rowVersion: 'A', mensaje: 'OK' })),
    };
    let store: SolicitudServicioFormStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [SolicitudServicioFormStore, { provide: SolicitudServicioApiService, useValue: apiMock }] });
        store = TestBed.inject(SolicitudServicioFormStore);
    });

    it('should initialize a new request', () => { store.initialize(null); expect(apiMock.getPersonaTiposDocumento).toHaveBeenCalledOnce(); expect(store.loading()).toBe(false); });
    it('should exclude Misa from generic service search', () => { store.searchServices('mi'); expect(apiMock.searchServicios).toHaveBeenCalledWith('mi', 10); expect(store.serviceResults().map(x => x.codigo)).toEqual(['CONSTANCIA']); });
    it('should search persons through request lookup', () => { store.searchPersons('jose'); expect(apiMock.searchPersonas).toHaveBeenCalledWith('jose', 10); });
    it('should create a request', () => { const request = { idServicio: 2, idPersona: null, requierePago: true, importe: null, motivoNoPago: null, observaciones: null }; store.create(request); expect(apiMock.create).toHaveBeenCalledWith(request); expect(store.saving()).toBe(false); });
});