import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { VentaApiService } from './venta-api.service';

describe('VentaApiService', () => {
    let service: VentaApiService;
    let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                VentaApiService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }
            ]
        });
        service = TestBed.inject(VentaApiService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpTesting.verify());

    it('should request sale catalogs', () => {
        service.getMetodosPago().subscribe();
        let request = httpTesting.expectOne(`${apiBaseUrl}/Venta/metodos-pago`);
        expect(request.request.method).toBe('GET');
        request.flush([]);

        service.getTiposComprobante().subscribe();
        request = httpTesting.expectOne(`${apiBaseUrl}/Venta/tipos-comprobante`);
        expect(request.request.method).toBe('GET');
        request.flush([]);
    });

    it('should search pending services', () => {
        service.searchServiciosPendientes('SS2026', 20).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Venta/solicitudes/pendientes`);
        expect(request.request.params.get('search')).toBe('SS2026');
        expect(request.request.params.get('top')).toBe('20');
        request.flush([]);
    });

    it('should search products', () => {
        service.searchProductos('vela', 10).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Venta/productos/search`);
        expect(request.request.params.get('search')).toBe('vela');
        expect(request.request.params.get('top')).toBe('10');
        request.flush([]);
    });

    it('should request a service by id', () => {
        service.getSolicitudById(25).subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Venta/solicitudes/25`);
        expect(request.request.method).toBe('GET');
        request.flush({ idSolicitudServicio: 25 });
    });


    it('should use sale-scoped person lookups', () => {
        service.getPersonaTiposDocumento().subscribe(); let request = httpTesting.expectOne(`${apiBaseUrl}/Venta/personas/tipos-documento`); request.flush([]);
        service.searchPersonas('jose', 10).subscribe(); request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Venta/personas/search`); expect(request.request.params.get('search')).toBe('jose'); request.flush([]);
        service.getPersonaByDocument(1, '12345678').subscribe(); request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Venta/personas/by-document`); expect(request.request.params.get('idTipoDocumento')).toBe('1'); request.flush(null);
        service.getPersonaById(5).subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/Venta/personas/5`); request.flush({ idPersona: 5 });

        const payload = { idTipoDocumento: 1, numeroDocumento: '12345678', nombreCompleto: 'CLIENTE PRUEBA', fechaNacimiento: null, telefono: null, email: null, direccion: null, roles: [] };
        service.createPersona(payload).subscribe();
        request = httpTesting.expectOne(`${apiBaseUrl}/Venta/personas`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        request.flush({ idPersona: 20, codPersona: 'PER-20', rowVersion: 'A', mensaje: 'Persona registrada.' });
    });

    it('should create a sale', () => {
        const payload = { idPersona: 1, idTipoComprobante: 1, idMetodoPago: 1, observaciones: null, items: [] };
        service.create(payload).subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Venta`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        request.flush({});
    });

    it('should request the sales list with filters', () => {
        service.getList({
            fechaInicio: '2026-08-01',
            fechaFin: '2026-08-20',
            idMetodoPago: 1,
            idTipoComprobante: 2,
            tipoItem: 'SERVICIO',
            texto: 'JOSE',
            pagina: 2,
            tamanoPagina: 20
        }).subscribe();

        const request = httpTesting.expectOne(req =>
            req.url === `${apiBaseUrl}/Venta`
        );

        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('fechaInicio')).toBe('2026-08-01');
        expect(request.request.params.get('fechaFin')).toBe('2026-08-20');
        expect(request.request.params.get('idMetodoPago')).toBe('1');
        expect(request.request.params.get('idTipoComprobante')).toBe('2');
        expect(request.request.params.get('tipoItem')).toBe('SERVICIO');
        expect(request.request.params.get('texto')).toBe('JOSE');
        expect(request.request.params.get('pagina')).toBe('2');
        expect(request.request.params.get('tamanoPagina')).toBe('20');

        request.flush({
            pagina: 2,
            tamanoPagina: 20,
            totalRegistros: 0,
            totalPaginas: 0,
            items: []
        });
    });

    it('should request cancellation reasons and sale detail', () => {
        service.getRazonesAnulacion().subscribe();

        let request = httpTesting.expectOne(`${apiBaseUrl}/Venta/razones-anulacion`);
        expect(request.request.method).toBe('GET');
        request.flush([]);

        service.getById(15).subscribe();

        request = httpTesting.expectOne(`${apiBaseUrl}/Venta/15`);
        expect(request.request.method).toBe('GET');
        request.flush({ idVenta: 15, detalles: [] });
    });

    it('should cancel a sale', () => {
        const payload = {
            idRazonAnulacion: 1,
            motivoAnulacion: 'Error de cobro',
            rowVersion: 'AAAAAAAABQ='
        };

        service.cancel(15, payload).subscribe();

        const request = httpTesting.expectOne(`${apiBaseUrl}/Venta/15/anular`);

        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toEqual(payload);

        request.flush({ idVenta: 15 });
    });
});
