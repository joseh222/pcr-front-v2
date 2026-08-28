import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { SolicitudServicioApiService } from './solicitud-servicio-api.service';

describe('SolicitudServicioApiService', () => {
    let service: SolicitudServicioApiService; let http: HttpTestingController; const apiBaseUrl = 'https://localhost:7002/api';
    beforeEach(() => { TestBed.configureTestingModule({ providers: [SolicitudServicioApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] }); service = TestBed.inject(SolicitudServicioApiService); http = TestBed.inject(HttpTestingController); });
    afterEach(() => http.verify());

    it('should request catalogs and filtered list', () => {
        service.getEstados().subscribe(); let req = http.expectOne(`${apiBaseUrl}/SolicitudServicio/estados`); req.flush([]);
        service.getEstadosPago().subscribe(); req = http.expectOne(`${apiBaseUrl}/SolicitudServicio/estados-pago`); req.flush([]);
        service.getList({ search: 'SS2026', idServicio: 2, estadoSolicitud: 'ACTIVA', estadoPago: 'PENDIENTE', requierePago: true, fechaInicio: '2026-08-01', fechaFin: '2026-08-20', pageNumber: 2, pageSize: 20 }).subscribe();
        req = http.expectOne(r => r.url === `${apiBaseUrl}/SolicitudServicio`); expect(req.request.params.get('idServicio')).toBe('2'); expect(req.request.params.get('estadoPago')).toBe('PENDIENTE'); expect(req.request.params.get('requierePago')).toBe('true'); expect(req.request.params.get('pageNumber')).toBe('2'); req.flush({ items: [] });
    });


    it('should use request-scoped service and person lookups', () => {
        service.searchServicios('const', 10).subscribe(); let req = http.expectOne(r => r.url === `${apiBaseUrl}/SolicitudServicio/servicios/search`); expect(req.request.params.get('search')).toBe('const'); req.flush([]);
        service.getServicioById(2).subscribe(); req = http.expectOne(`${apiBaseUrl}/SolicitudServicio/servicios/2`); req.flush({ idServicio: 2 });
        service.getPersonaTiposDocumento().subscribe(); req = http.expectOne(`${apiBaseUrl}/SolicitudServicio/personas/tipos-documento`); req.flush([]);
        service.searchPersonas('jose', 10).subscribe(); req = http.expectOne(r => r.url === `${apiBaseUrl}/SolicitudServicio/personas/search`); req.flush([]);
        service.getPersonaByDocument(1, '12345678').subscribe(); req = http.expectOne(r => r.url === `${apiBaseUrl}/SolicitudServicio/personas/by-document`); req.flush(null);

        const payload = { idTipoDocumento: null, numeroDocumento: null, nombreCompleto: 'SOLICITANTE PRUEBA', fechaNacimiento: null, telefono: null, email: null, direccion: null, roles: [] };
        service.createPersona(payload).subscribe();
        req = http.expectOne(`${apiBaseUrl}/SolicitudServicio/personas`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush({ idPersona: 3, codPersona: 'PER-3', rowVersion: 'A', mensaje: 'OK' });
    });

    it('should get, create, update and cancel a request', () => {
        service.getById(10).subscribe(); let req = http.expectOne(`${apiBaseUrl}/SolicitudServicio/10`); expect(req.request.method).toBe('GET'); req.flush({});
        const create = { idServicio: 2, idPersona: null, requierePago: true, importe: 20, motivoNoPago: null, observaciones: null };
        service.create(create).subscribe(); req = http.expectOne(`${apiBaseUrl}/SolicitudServicio`); expect(req.request.method).toBe('POST'); expect(req.request.body).toEqual(create); req.flush({});
        const update = { idPersona: 1, requierePago: true, importe: 20, motivoNoPago: null, observaciones: null, rowVersion: 'A' };
        service.update(10, update).subscribe(); req = http.expectOne(`${apiBaseUrl}/SolicitudServicio/10`); expect(req.request.method).toBe('PUT'); expect(req.request.body).toEqual(update); req.flush({});
        const cancel = { motivo: 'Cancelado', rowVersion: 'A' };
        service.cancel(10, cancel).subscribe(); req = http.expectOne(`${apiBaseUrl}/SolicitudServicio/10/anular`); expect(req.request.method).toBe('PATCH'); expect(req.request.body).toEqual(cancel); req.flush({});
    });
    it('should get service catalog through request module', () => { service.getServicios().subscribe(); const request = http.expectOne(req => req.url === `${apiBaseUrl}/SolicitudServicio/servicios`); expect(request.request.method).toBe('GET'); request.flush({ items: [], pageNumber: 1, pageSize: 100, totalRecords: 0, totalPages: 0 }); });
});
