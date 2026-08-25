import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ProveedorApiService } from './proveedor-api.service';

describe('ProveedorApiService', () => {
    let service: ProveedorApiService;
    let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [ProveedorApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] });
        service = TestBed.inject(ProveedorApiService); httpTesting = TestBed.inject(HttpTestingController);
    });
    afterEach(() => httpTesting.verify());

    it('should request document types', () => {
        service.getTiposDocumento().subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Proveedor/tipos-documento`);
        expect(request.request.method).toBe('GET'); request.flush([]);
    });

    it('should request supplier list with filters', () => {
        service.getList({ search: 'san', idTipoDocumento: 3, isActive: false, pageNumber: 2, pageSize: 20 }).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Proveedor`);
        expect(request.request.params.get('search')).toBe('san');
        expect(request.request.params.get('idTipoDocumento')).toBe('3');
        expect(request.request.params.get('isActive')).toBe('false');
        expect(request.request.params.get('pageNumber')).toBe('2');
        expect(request.request.params.get('pageSize')).toBe('20');
        request.flush({ items: [], pageNumber: 2, pageSize: 20, totalRecords: 0, totalPages: 0 });
    });

    it('should search active suppliers', () => {
        service.search('san', 10).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Proveedor/search`);
        expect(request.request.params.get('search')).toBe('san');
        expect(request.request.params.get('top')).toBe('10');
        request.flush([]);
    });

    it('should create, update and change status', () => {
        const create = { idTipoDocumento: 3, numeroDocumento: '20123456789', razonSocial: 'Proveedor SAC', nombreComercial: null, telefono: null, email: null, direccion: null, observaciones: null };
        service.create(create).subscribe(); let request = httpTesting.expectOne(`${apiBaseUrl}/Proveedor`); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(create); request.flush({});
        const update = { ...create, razonSocial: 'Proveedor Editado SAC', rowVersion: 'AAAAAAAABQ=' };
        service.update(5, update).subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/Proveedor/5`); expect(request.request.method).toBe('PUT'); expect(request.request.body).toEqual(update); request.flush({});
        const status = { isActive: false, rowVersion: 'AAAAAAAABQ=' };
        service.changeStatus(5, status).subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/Proveedor/5/status`); expect(request.request.method).toBe('PATCH'); request.flush({});
    });
});
