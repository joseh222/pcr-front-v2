import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { CompraApiService } from './compra-api.service';

describe('CompraApiService', () => {
    let service: CompraApiService;
    let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [CompraApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] });
        service = TestBed.inject(CompraApiService); httpTesting = TestBed.inject(HttpTestingController);
    });
    afterEach(() => httpTesting.verify());

    it('should request purchase voucher types', () => {
        service.getTiposComprobante().subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Compra/tipos-comprobante`);
        expect(request.request.method).toBe('GET'); request.flush([]);
    });

    it('should register a purchase', () => {
        const body = { idProveedor: 2, idTipoComprobanteCompra: 1, fechaCompra: '2026-08-25', serieComprobante: 'F001', numeroComprobante: '900001', observaciones: null, items: [{ idProducto: 8, cantidad: 2, costoUnitario: 5.5 }] };
        service.create(body).subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Compra`);
        expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(body);
        request.flush({ idCompra: 1, codCompra: 'CMP2026-000001' });
    });
});
