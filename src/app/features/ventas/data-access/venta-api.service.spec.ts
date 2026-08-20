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
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/SolicitudServicio/pendientes`);
        expect(request.request.params.get('search')).toBe('SS2026');
        expect(request.request.params.get('top')).toBe('20');
        request.flush([]);
    });

    it('should search products', () => {
        service.searchProductos('vela', 10).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Producto/search`);
        expect(request.request.params.get('search')).toBe('vela');
        expect(request.request.params.get('top')).toBe('10');
        request.flush([]);
    });

    it('should request a service by id', () => {
        service.getSolicitudById(25).subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/SolicitudServicio/25`);
        expect(request.request.method).toBe('GET');
        request.flush({ idSolicitudServicio: 25 });
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
});
