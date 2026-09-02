import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ReporteComprasApiService } from './reporte-compras-api.service';

describe('ReporteComprasApiService', () => {
    let service: ReporteComprasApiService; let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api'; const filters = { fechaInicio: '2026-08-01', fechaFin: '2026-08-31' };
    beforeEach(() => { TestBed.configureTestingModule({ providers: [ReporteComprasApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] }); service = TestBed.inject(ReporteComprasApiService); httpTesting = TestBed.inject(HttpTestingController); });
    afterEach(() => httpTesting.verify());

    it('should request the purchases report with date filters', () => {
        service.get(filters).subscribe(); const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/compras`);
        expect(request.request.params.get('fechaInicio')).toBe('2026-08-01'); expect(request.request.params.get('fechaFin')).toBe('2026-08-31');
        request.flush({ fechaInicio: filters.fechaInicio, fechaFin: filters.fechaFin, cantidadCompras: 0, totalComprado: 0, compraPromedio: 0, cantidadAnuladas: 0, totalAnulado: 0, proveedores: [], tendenciaDiaria: [], productos: [] });
    });

    it('should export Excel and PDF as blobs', () => {
        service.exportExcel(filters).subscribe(); let request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/compras/excel`); expect(request.request.responseType).toBe('blob'); request.flush(new Blob());
        service.exportPdf(filters).subscribe(); request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/compras/pdf`); expect(request.request.responseType).toBe('blob'); request.flush(new Blob());
    });
});
