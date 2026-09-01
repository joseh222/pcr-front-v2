import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ReporteVentasApiService } from './reporte-ventas-api.service';

describe('ReporteVentasApiService', () => {
    let service: ReporteVentasApiService;
    let httpTesting: HttpTestingController;
    const apiBaseUrl = 'https://localhost:7002/api';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ReporteVentasApiService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }
            ]
        });
        service = TestBed.inject(ReporteVentasApiService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpTesting.verify());

    it('should request the sales report with applied filters', () => {
        service.get({ fechaInicio: '2026-09-01', fechaFin: '2026-09-30', tipoItem: 'SERVICIO' }).subscribe();

        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/ventas`);
        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('fechaInicio')).toBe('2026-09-01');
        expect(request.request.params.get('fechaFin')).toBe('2026-09-30');
        expect(request.request.params.get('tipoItem')).toBe('SERVICIO');
        request.flush({
            fechaInicio: '2026-09-01', fechaFin: '2026-09-30', cantidadVentas: 0,
            totalVendido: 0, ticketPromedio: 0, cantidadAnuladas: 0, totalAnulado: 0,
            metodosPago: [], tendenciaDiaria: [], contenidos: []
        });
    });

    it('should omit optional content filter', () => {
        service.get({ fechaInicio: '2026-09-01', fechaFin: '2026-09-30', tipoItem: null }).subscribe();
        const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/reportes/ventas`);
        expect(request.request.params.has('tipoItem')).toBe(false);
        request.flush({
            fechaInicio: '2026-09-01', fechaFin: '2026-09-30', cantidadVentas: 0,
            totalVendido: 0, ticketPromedio: 0, cantidadAnuladas: 0, totalAnulado: 0,
            metodosPago: [], tendenciaDiaria: [], contenidos: []
        });
    });
});
