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

    it('should search a person by document', () => {
        service.getByDocument(1, '12345678').subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiUrl}/by-document`);
        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('idTipoDocumento')).toBe('1');
        expect(request.request.params.get('numeroDocumento')).toBe('12345678');
        request.flush(null);
    });


    it('should request a person by id', () => {
        service.getById(25).subscribe();
        const request = httpTesting.expectOne(`${apiUrl}/25`);
        expect(request.request.method).toBe('GET');
        request.flush({ idPersona: 25 });
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

});