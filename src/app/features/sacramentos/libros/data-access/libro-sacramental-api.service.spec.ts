import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { LibroSacramentalApiService } from './libro-sacramental-api.service';

describe('LibroSacramentalApiService', () => {
    let service: LibroSacramentalApiService; let httpTesting: HttpTestingController; const apiBaseUrl = 'https://localhost:9001/api';
    beforeEach(() => { TestBed.configureTestingModule({ providers: [LibroSacramentalApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] }); service = TestBed.inject(LibroSacramentalApiService); httpTesting = TestBed.inject(HttpTestingController); });
    afterEach(() => httpTesting.verify());
    it('should request books with filters', () => { service.getList({ idTipoSacramento: 1, codigoEstadoFisico: 'CERRADO', numeroLibro: '11' }).subscribe(); const request = httpTesting.expectOne(req => req.url === `${apiBaseUrl}/LibroSacramental`); expect(request.request.params.get('idTipoSacramento')).toBe('1'); expect(request.request.params.get('codigoEstadoFisico')).toBe('CERRADO'); expect(request.request.params.get('numeroLibro')).toBe('11'); request.flush([]); });
    it('should request folios and lifecycle endpoints', () => { service.getFolios(7, '23').subscribe(); let request = httpTesting.expectOne(`${apiBaseUrl}/LibroSacramental/7/folios?numeroFolio=23`); request.flush([]); service.changePhysicalStatus(7, 'EN_USO').subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/LibroSacramental/7/estado-fisico`); expect(request.request.method).toBe('PATCH'); expect(request.request.body).toEqual({ codigoEstadoDestino: 'EN_USO' }); request.flush({ idLibroSacramental: 7, estadoFisico: 'EN_USO', rowVersion: 'A', mensaje: 'OK' }); service.reopenDigitization(7).subscribe(); request = httpTesting.expectOne(`${apiBaseUrl}/LibroSacramental/7/digitalizacion/reabrir`); expect(request.request.method).toBe('POST'); expect(request.request.body).toEqual({ confirmarReapertura: true }); request.flush({ idLibroSacramental: 7, estadoDigitalizacion: 'EN_PROCESO', rowVersion: 'B', mensaje: 'OK' }); });
});
