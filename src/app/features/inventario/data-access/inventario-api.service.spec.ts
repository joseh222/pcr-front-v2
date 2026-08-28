import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { InventarioApiService } from './inventario-api.service';

describe('InventarioApiService', () => {
    let service: InventarioApiService;
    let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [InventarioApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }]
        });
        service = TestBed.inject(InventarioApiService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpTesting.verify());

    it('should request manual movement types', () => {
        service.getTiposMovimiento().subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Inventario/tipos-movimiento`);
        expect(request.request.method).toBe('GET');
        request.flush([]);
    });


    it('should request historical movement types', () => {
        service.getTiposMovimientoHistorial().subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Inventario/tipos-movimiento/historial`);
        expect(request.request.method).toBe('GET');
        request.flush([]);
    });

    it('should request paged inventory movements', () => {
        service.getMovimientos({ idProducto: 5, idTipoMovimiento: 2, fechaInicio: '2026-08-01', fechaFin: '2026-08-20', pageNumber: 2, pageSize: 20 }).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Inventario/movimientos`);
        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('idProducto')).toBe('5');
        expect(request.request.params.get('idTipoMovimiento')).toBe('2');
        expect(request.request.params.get('fechaInicio')).toBe('2026-08-01');
        expect(request.request.params.get('fechaFin')).toBe('2026-08-20');
        expect(request.request.params.get('pageNumber')).toBe('2');
        expect(request.request.params.get('pageSize')).toBe('20');
        request.flush({ items: [], pageNumber: 2, pageSize: 20, totalRecords: 0, totalPages: 0 });
    });


    it('should request inventory-scoped product catalog', () => {
        service.getProductos({ search: null, idCategoriaProducto: null, idMarcaProducto: null, isActive: null, pageNumber: 1, pageSize: 100 }).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Inventario/productos`);
        expect(request.request.method).toBe('GET'); expect(request.request.params.get('pageSize')).toBe('100');
        request.flush({ items: [], pageNumber: 1, pageSize: 100, totalRecords: 0, totalPages: 0 });
    });

    it('should request product inventory', () => {
        service.getByProducto(5).subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Inventario/productos/5`);
        expect(request.request.method).toBe('GET');
        request.flush({ idProducto: 5 });
    });

    it('should create an inventory movement', () => {
        const payload = { idTipoMovimiento: 2, cantidad: 5, costoUnitario: 2.5, motivo: 'Reposición' };
        service.createMovimiento(5, payload).subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Inventario/productos/5/movimientos`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        request.flush({ idMovimiento: 1 });
    });
});
