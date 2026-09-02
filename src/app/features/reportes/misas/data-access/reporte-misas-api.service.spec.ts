import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ReporteMisasApiService } from './reporte-misas-api.service';

describe('ReporteMisasApiService', () => {
    let service: ReporteMisasApiService; let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';
    const filters = { fechaInicio: '2026-08-01', fechaFin: '2026-08-31', idModalidad: 1, idTipo: 2, idEstado: 1, estadoPago: 'PAGADO' as const };
    beforeEach(() => { TestBed.configureTestingModule({ providers: [ReporteMisasApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] }); service = TestBed.inject(ReporteMisasApiService); httpTesting = TestBed.inject(HttpTestingController); });
    afterEach(() => httpTesting.verify());

    it('should request the masses report with applied filters', () => {
        service.get(filters).subscribe(); const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/misas`);
        expect(request.request.params.get('idModalidad')).toBe('1'); expect(request.request.params.get('estadoPago')).toBe('PAGADO');
        request.flush({ fechaInicio: filters.fechaInicio, fechaFin: filters.fechaFin, cantidadMisas: 0, cantidadPagadas: 0, montoPagado: 0, cantidadPendientesPago: 0, montoPendiente: 0, cantidadNoRequierenPago: 0, cantidadCelebradas: 0, cantidadSinSolicitud: 0, modalidades: [], tipos: [], estados: [], estadosPago: [], tendenciaDiaria: [] });
    });

    it('should export Excel and PDF as blobs with the same filters', () => {
        service.exportExcel(filters).subscribe(); let request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/misas/excel`); expect(request.request.responseType).toBe('blob'); expect(request.request.params.get('idTipo')).toBe('2'); request.flush(new Blob());
        service.exportPdf(filters).subscribe(); request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/misas/pdf`); expect(request.request.responseType).toBe('blob'); expect(request.request.params.get('estadoPago')).toBe('PAGADO'); request.flush(new Blob());
    });
});
