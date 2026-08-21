import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ProductoApiService } from './producto-api.service';

describe('ProductoApiService', () => {
    let service: ProductoApiService;
    let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [ProductoApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] });
        service = TestBed.inject(ProductoApiService); httpTesting = TestBed.inject(HttpTestingController);
    });
    afterEach(() => httpTesting.verify());

    it('should request catalogs', () => {
        service.getCategorias().subscribe(); let request = httpTesting.expectOne(`${apiBaseUrl}/Producto/categorias`); expect(request.request.method).toBe('GET'); request.flush([]);
        service.getMarcas().subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/Producto/marcas`); expect(request.request.method).toBe('GET'); request.flush([]);
    });

    it('should request product list with filters', () => {
        service.getList({ search: 'vela', idCategoriaProducto: 1, idMarcaProducto: 2, isActive: false, pageNumber: 2, pageSize: 20 }).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Producto`);
        expect(request.request.params.get('search')).toBe('vela'); expect(request.request.params.get('idCategoriaProducto')).toBe('1');
        expect(request.request.params.get('idMarcaProducto')).toBe('2'); expect(request.request.params.get('isActive')).toBe('false');
        expect(request.request.params.get('pageNumber')).toBe('2'); expect(request.request.params.get('pageSize')).toBe('20');
        request.flush({ items: [], pageNumber: 2, pageSize: 20, totalRecords: 0, totalPages: 0 });
    });

    it('should create, update and change product status', () => {
        const create = { idCategoriaProducto: 1, idMarcaProducto: null, nombre: 'Vela', sku: 'VEL-001', descripcion: null, precioCompra: 2, precioVenta: 5 };
        service.create(create).subscribe(); let request = httpTesting.expectOne(`${apiBaseUrl}/Producto`); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(create); request.flush({});
        const update = { ...create, rowVersion: 'AAAAAAAABQ=' };
        service.update(5, update).subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/Producto/5`); expect(request.request.method).toBe('PUT'); expect(request.request.body).toEqual(update); request.flush({});
        const status = { isActive: false, rowVersion: 'AAAAAAAABQ=' };
        service.changeStatus(5, status).subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/Producto/5/status`); expect(request.request.method).toBe('PATCH'); expect(request.request.body).toEqual(status); request.flush({});
    });

    it('should request product detail', () => {
        service.getById(5).subscribe(); const request = httpTesting.expectOne(`${apiBaseUrl}/Producto/5`); expect(request.request.method).toBe('GET'); request.flush({ idProducto: 5 });
    });
});
