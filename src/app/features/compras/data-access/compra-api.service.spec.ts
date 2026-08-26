import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { CompraApiService } from './compra-api.service';

describe('CompraApiService', () => {
    let service: CompraApiService; let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [CompraApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] });
        service = TestBed.inject(CompraApiService); httpTesting = TestBed.inject(HttpTestingController);
    });
    afterEach(() => httpTesting.verify());

    it('should request purchase catalogs', () => {
        service.getEstados().subscribe(); let request = httpTesting.expectOne(`${apiBaseUrl}/Compra/estados`); expect(request.request.method).toBe('GET'); request.flush([]);
        service.getTiposComprobante().subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/Compra/tipos-comprobante`); expect(request.request.method).toBe('GET'); request.flush([]);
    });

    it('should request purchase list with filters', () => {
        service.getList({ search: 'CMP', idProveedor: 2, idTipoComprobanteCompra: 1, idEstadoCompra: 1, fechaInicio: '2026-08-01', fechaFin: '2026-08-31', pageNumber: 2, pageSize: 20 }).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Compra`);
        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('search')).toBe('CMP'); expect(request.request.params.get('idProveedor')).toBe('2');
        expect(request.request.params.get('idTipoComprobanteCompra')).toBe('1'); expect(request.request.params.get('idEstadoCompra')).toBe('1');
        expect(request.request.params.get('fechaInicio')).toBe('2026-08-01'); expect(request.request.params.get('fechaFin')).toBe('2026-08-31');
        expect(request.request.params.get('pageNumber')).toBe('2'); expect(request.request.params.get('pageSize')).toBe('20');
        request.flush({ pageNumber: 2, pageSize: 20, totalRows: 0, totalPages: 0, items: [] });
    });

    it('should request purchase detail', () => {
        service.getById(5).subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Compra/5`);
        expect(request.request.method).toBe('GET');
        request.flush({ idCompra: 5, codCompra: 'CMP2026-000005', detalles: [] });
    });

    it('should register a purchase', () => {
        const body = { idProveedor: 2, idTipoComprobanteCompra: 1, fechaCompra: '2026-08-25', serieComprobante: 'F001', numeroComprobante: '900001', observaciones: null, items: [{ idProducto: 8, cantidad: 2, costoUnitario: 5.5 }] };
        service.create(body).subscribe(); const request = httpTesting.expectOne(`${apiBaseUrl}/Compra`);
        expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(body); request.flush({ idCompra: 1, codCompra: 'CMP2026-000001' });
    });
});
