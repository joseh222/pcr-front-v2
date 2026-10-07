import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { PersonaApiService } from './persona-api.service';

describe('PersonaApiService', () => {
    let service: PersonaApiService;
    let httpTesting: HttpTestingController;
    const apiUrl = 'https://localhost:7002/api/Persona';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PersonaApiService, provideHttpClient(), provideHttpClientTesting(),
                { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl: 'https://localhost:7002/api' } } }
            ]
        });
        service = TestBed.inject(PersonaApiService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpTesting.verify());

    it('should request document types', () => {
        service.getTiposDocumento().subscribe();
        const request = httpTesting.expectOne(`${apiUrl}/tipos-documento`);
        expect(request.request.method).toBe('GET');
        request.flush([]);
    });

    it('should request person roles', () => {
        service.getRoles().subscribe();
        const request = httpTesting.expectOne(`${apiUrl}/roles`);
        expect(request.request.method).toBe('GET');
        request.flush([]);
    });

    it('should request paginated persons with filters', () => {
        service.getList({ search: ' JOSE ', idTipoDocumento: 1, idRolPersona: 7, isActive: false, pageNumber: 2, pageSize: 20 }).subscribe();
        const request = httpTesting.expectOne(req => req.url === apiUrl);
        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('search')).toBe('JOSE');
        expect(request.request.params.get('idTipoDocumento')).toBe('1');
        expect(request.request.params.get('idRolPersona')).toBe('7');
        expect(request.request.params.get('isActive')).toBe('false');
        expect(request.request.params.get('pageNumber')).toBe('2');
        expect(request.request.params.get('pageSize')).toBe('20');
        request.flush({ items: [], pageNumber: 2, pageSize: 20, totalRecords: 0, totalPages: 0 });
    });

    it('should omit empty optional list filters', () => {
        service.getList({ search: '   ', idTipoDocumento: null, idRolPersona: null, pageNumber: 1, pageSize: 20 }).subscribe();
        const request = httpTesting.expectOne(req => req.url === apiUrl);
        expect(request.request.params.has('search')).toBe(false);
        expect(request.request.params.has('idTipoDocumento')).toBe(false);
        expect(request.request.params.has('idRolPersona')).toBe(false);
        expect(request.request.params.has('isActive')).toBe(false);
        request.flush({ items: [], pageNumber: 1, pageSize: 20, totalRecords: 0, totalPages: 0 });
    });

    it('should search a person by document', () => {
        service.getByDocument(1, '12345678').subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiUrl}/by-document`);
        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('idTipoDocumento')).toBe('1');
        expect(request.request.params.get('numeroDocumento')).toBe('12345678');
        request.flush(null);
    });

    it('should request a person detail by id', () => {
        service.getById(25).subscribe();
        const request = httpTesting.expectOne(`${apiUrl}/25`);
        expect(request.request.method).toBe('GET');
        request.flush({ idPersona: 25, roles: [] });
    });

    it('should search persons by text', () => {
        service.search('JOSE', 10).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiUrl}/search`);
        expect(request.request.params.get('search')).toBe('JOSE');
        expect(request.request.params.get('top')).toBe('10');
        request.flush([]);
    });

    it('should create a person', () => {
        const payload = {
            idTipoDocumento: 1, numeroDocumento: '12345678', nombreCompleto: 'JOSE HUAMAN',
            fechaNacimiento: null, telefono: '999999999', email: null, direccion: null, roles: []
        };

        service.create(payload).subscribe();
        const request = httpTesting.expectOne(apiUrl);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        request.flush({ idPersona: 25, codPersona: 'PER-25', rowVersion: '', mensaje: 'OK' });
    });

    it('should update a person', () => {
        const payload = {
            idTipoDocumento: 1, numeroDocumento: '12345678', nombreCompleto: 'JOSE HUAMAN',
            fechaNacimiento: '1990-05-10', telefono: '999999999', email: 'jose@correo.pe',
            direccion: 'Pueblo Nuevo', roles: [7], rowVersion: 'AAAAAAAAB9E='
        };

        service.update(25, payload).subscribe();
        const request = httpTesting.expectOne(`${apiUrl}/25`);
        expect(request.request.method).toBe('PUT');
        expect(request.request.body).toEqual(payload);
        request.flush({ idPersona: 25, codPersona: 'PER-25', rowVersion: 'AAAAAAAAB9F=', mensaje: 'OK' });
    });

    it('should change person status', () => {
        const payload = { isActive: false, rowVersion: 'AAAAAAAAB9E=' };
        service.changeStatus(25, payload).subscribe();
        const request = httpTesting.expectOne(`${apiUrl}/25/status`);
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toEqual(payload);
        request.flush({ idPersona: 25, isActive: false, rowVersion: 'AAAAAAAAB9F=', mensaje: 'OK' });
    });
});
