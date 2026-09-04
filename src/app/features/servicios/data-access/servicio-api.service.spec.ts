import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ServicioApiService } from './servicio-api.service';

describe('ServicioApiService', () => {
    let service: ServicioApiService;
    let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [ServicioApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] });
        service = TestBed.inject(ServicioApiService); httpTesting = TestBed.inject(HttpTestingController);
    });
    afterEach(() => httpTesting.verify());

    it('should request categories and sacrament types', () => {
        service.getCategorias().subscribe();
        let request = httpTesting.expectOne(`${apiBaseUrl}/Servicio/categorias`);
        expect(request.request.method).toBe('GET'); request.flush([]);
        service.getTiposSacramento().subscribe();
        request = httpTesting.expectOne(`${apiBaseUrl}/Servicio/tipos-sacramento`);
        expect(request.request.method).toBe('GET'); request.flush([]);
    });

    it('should request service list with filters', () => {
        service.getList({ search: 'misa', idCategoriaServicio: 1, modoPrecio: 'FIJO', isActive: false, pageNumber: 2, pageSize: 20 }).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Servicio`);
        expect(request.request.params.get('search')).toBe('misa');
        expect(request.request.params.get('idCategoriaServicio')).toBe('1');
        expect(request.request.params.get('modoPrecio')).toBe('FIJO');
        expect(request.request.params.get('isActive')).toBe('false');
        expect(request.request.params.get('pageNumber')).toBe('2');
        expect(request.request.params.get('pageSize')).toBe('20');
        request.flush({ items: [], pageNumber: 2, pageSize: 20, totalRecords: 0, totalPages: 0 });
    });

    it('should search active services', () => {
        service.search('const', 10).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/Servicio/search`);
        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('search')).toBe('const');
        expect(request.request.params.get('top')).toBe('10');
        request.flush([]);
    });

    it('should create, update and change service status', () => {
        const create = { codigo: 'CONSTANCIA', idCategoriaServicio: 1, nombre: 'Constancia', descripcion: null, modoPrecio: 'FIJO' as const, precioBase: 15, idTipoSacramentoRequerido: 1 };
        service.create(create).subscribe(); let request = httpTesting.expectOne(`${apiBaseUrl}/Servicio`); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual(create); request.flush({});
        const update = { idCategoriaServicio: 1, nombre: 'Constancia actualizada', descripcion: null, modoPrecio: 'VARIABLE' as const, precioBase: null, idTipoSacramentoRequerido: 1, actualizarTipoSacramento: true, rowVersion: 'AAAAAAAABQ=' };
        service.update(5, update).subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/Servicio/5`); expect(request.request.method).toBe('PUT'); expect(request.request.body).toEqual(update); request.flush({});
        const status = { isActive: false, rowVersion: 'AAAAAAAABQ=' };
        service.changeStatus(5, status).subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/Servicio/5/status`); expect(request.request.method).toBe('PATCH'); expect(request.request.body).toEqual(status); request.flush({});
    });

    it('should request service detail', () => {
        service.getById(5).subscribe();
        const request = httpTesting.expectOne(`${apiBaseUrl}/Servicio/5`);
        expect(request.request.method).toBe('GET'); request.flush({ idServicio: 5 });
    });
});
