import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ResumenEconomicoApiService } from './resumen-economico-api.service';

describe('ResumenEconomicoApiService', () => {
    let service: ResumenEconomicoApiService; let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api'; const filters = { fechaInicio: '2026-08-01', fechaFin: '2026-08-31' };
    beforeEach(() => { TestBed.configureTestingModule({ providers: [ResumenEconomicoApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] }); service = TestBed.inject(ResumenEconomicoApiService); httpTesting = TestBed.inject(HttpTestingController); });
    afterEach(() => httpTesting.verify());

    it('should request the economic summary with date filters', () => {
        service.get(filters).subscribe(); const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/resumen-economico`);
        expect(request.request.params.get('fechaInicio')).toBe('2026-08-01');
        request.flush({ fechaInicio: filters.fechaInicio, fechaFin: filters.fechaFin, cantidadVentas: 0, totalIngresos: 0, cantidadCompras: 0, totalEgresos: 0, saldoPeriodo: 0, saldoSobreIngresosPorcentaje: 0, metodosPago: [], flujoDiario: [], composicionVentas: [] });
    });

    it('should export Excel and PDF as blobs', () => {
        service.exportExcel(filters).subscribe(); let request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/resumen-economico/excel`); expect(request.request.responseType).toBe('blob'); request.flush(new Blob());
        service.exportPdf(filters).subscribe(); request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/resumen-economico/pdf`); expect(request.request.responseType).toBe('blob'); request.flush(new Blob());
    });
});
