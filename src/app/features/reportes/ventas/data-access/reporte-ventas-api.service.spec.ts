import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ReporteVentasApiService } from './reporte-ventas-api.service';

describe('ReporteVentasApiService', () => {
    let service: ReporteVentasApiService;
    let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';
    const filters = { fechaInicio: '2026-08-01', fechaFin: '2026-08-31', tipoItem: 'SERVICIO' as const };

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [ReporteVentasApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] });
        service = TestBed.inject(ReporteVentasApiService); httpTesting = TestBed.inject(HttpTestingController);
    });
    afterEach(() => httpTesting.verify());

    it('should request the sales report with applied filters', () => {
        service.get(filters).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/ventas`);
        expect(request.request.method).toBe('GET'); expect(request.request.params.get('tipoItem')).toBe('SERVICIO');
        request.flush({ fechaInicio: filters.fechaInicio, fechaFin: filters.fechaFin, cantidadVentas: 0, totalVendido: 0, ticketPromedio: 0, cantidadAnuladas: 0, totalAnulado: 0, metodosPago: [], tendenciaDiaria: [], contenidos: [] });
    });

    it('should export Excel and PDF as blobs with the same filters', () => {
        service.exportExcel(filters).subscribe();
        let request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/ventas/excel`);
        expect(request.request.method).toBe('GET'); expect(request.request.responseType).toBe('blob'); expect(request.request.params.get('tipoItem')).toBe('SERVICIO'); request.flush(new Blob());
        service.exportPdf(filters).subscribe();
        request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/ventas/pdf`);
        expect(request.request.method).toBe('GET'); expect(request.request.responseType).toBe('blob'); expect(request.request.params.get('fechaInicio')).toBe('2026-08-01'); request.flush(new Blob());
    });
});
