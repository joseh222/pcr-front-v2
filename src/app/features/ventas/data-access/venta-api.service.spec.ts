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

    it('should export the filtered sales without pagination', () => {
        const filters = {
            fechaInicio: '2026-08-01',
            fechaFin: '2026-08-31',
            idMetodoPago: 1,
            idTipoComprobante: 2,
            tipoItem: 'SERVICIO' as const,
            texto: 'JOSE'
        };

        service.exportExcel(filters).subscribe();
        let request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Venta/exportar/excel`);
        expect(request.request.method).toBe('GET');
        expect(request.request.responseType).toBe('blob');
        expect(request.request.params.get('fechaInicio')).toBe('2026-08-01');
        expect(request.request.params.get('fechaFin')).toBe('2026-08-31');
        expect(request.request.params.get('idMetodoPago')).toBe('1');
        expect(request.request.params.get('idTipoComprobante')).toBe('2');
        expect(request.request.params.get('tipoItem')).toBe('SERVICIO');
        expect(request.request.params.get('texto')).toBe('JOSE');
        expect(request.request.params.has('pagina')).toBe(false);
        expect(request.request.params.has('tamanoPagina')).toBe(false);
        request.flush(new Blob(['xlsx']));

        service.exportPdf(filters).subscribe();
        request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Venta/exportar/pdf`);
        expect(request.request.method).toBe('GET');
        expect(request.request.responseType).toBe('blob');
        expect(request.request.params.has('pagina')).toBe(false);
        expect(request.request.params.has('tamanoPagina')).toBe(false);
        request.flush(new Blob(['pdf'], { type: 'application/pdf' }));
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

    it('should request the sale ticket as pdf blob', () => {
        service.getTicket(15).subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Venta/15/ticket`);
        expect(request.request.method).toBe('GET');
        expect(request.request.responseType).toBe('blob');
        request.flush(new Blob(['pdf'], { type: 'application/pdf' }));
    });

    it('should request automatic sale documents', () => {
        service.getDocuments(15).subscribe();
        let request = httpTesting.expectOne(`${apiBaseUrl}/Venta/15/documentos`);
        expect(request.request.method).toBe('GET'); request.flush({ idVenta: 15, documentos: [] });

        service.getDocumentsPdf(15).subscribe();
        request = httpTesting.expectOne(`${apiBaseUrl}/Venta/15/documentos/pdf`);
        expect(request.request.responseType).toBe('blob'); request.flush(new Blob(['pdf']));

        service.getMisasTicket(15).subscribe();
        request = httpTesting.expectOne(`${apiBaseUrl}/Venta/15/documentos/misas`);
        expect(request.request.responseType).toBe('blob'); request.flush(new Blob(['misas']));
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

    it('should register a manual print request', () => {
        service.requestPrint(15, 'MISA_REGISTRO').subscribe();
        const req = httpTesting.expectOne(`${apiBaseUrl}/Venta/15/documentos/MISA_REGISTRO/solicitudes-impresion`);
        expect(req.request.method).toBe('POST');
        req.flush({ tipoDocumento: 'MISA_REGISTRO', numeroSolicitud: 2, esReimpresion: true, fechaUtc: '2026-08-28T10:00:00Z', mensaje: 'Reimpresión solicitada.' });
    });
    it('should get print mode and request automatic print', () => {
        service.getPrintMode().subscribe();
        let req = httpTesting.expectOne(`${apiBaseUrl}/Venta/impresion/configuracion`);
        expect(req.request.method).toBe('GET'); req.flush({ modo: 'AUTOMATICO', isActive: true });
        service.printDocument(15, 'VENTA_TICKET').subscribe();
        req = httpTesting.expectOne(`${apiBaseUrl}/Venta/15/documentos/VENTA_TICKET/imprimir`);
        expect(req.request.method).toBe('POST'); req.flush({ tipoDocumento: 'VENTA_TICKET', numeroSolicitud: 1, exitosa: true, impresora: '80mm Series Printer', mensaje: 'OK' });
    });

});
