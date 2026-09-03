import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ConfiguracionApiService } from './configuracion-api.service';

describe('ConfiguracionApiService', () => {
    let service: ConfiguracionApiService; let http: HttpTestingController; const apiBaseUrl = 'https://localhost:7002/api';
    beforeEach(() => { TestBed.configureTestingModule({ providers: [ConfiguracionApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] }); service = TestBed.inject(ConfiguracionApiService); http = TestBed.inject(HttpTestingController); });
    afterEach(() => http.verify());
    it('should get and update print configuration', () => {
        service.getImpresion().subscribe(); let req = http.expectOne(`${apiBaseUrl}/General/configuracion/impresion`); expect(req.request.method).toBe('GET'); req.flush({});
        const payload = { modo: 'MANUAL' as const, tipoConexion: 'RED' as const, nombreImpresoraWindows: '80mm Series Printer', direccionIp: '192.168.1.114', puerto: 9100, anchoPapelMm: 80, imprimirTicketVenta: true, imprimirDocumentosAsociados: true, cortarEntreDocumentos: true, isActive: true, rowVersion: 'AAAA' };
        service.updateImpresion(payload).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/impresion`); expect(req.request.method).toBe('PUT'); expect(req.request.body).toEqual(payload); req.flush({});
    });
    it('should get and update sacramental text configuration', () => {
        service.getSacramental().subscribe(); let req = http.expectOne(`${apiBaseUrl}/General/configuracion/sacramental`); expect(req.request.method).toBe('GET'); req.flush({ forzarMayusculas: true });
        const payload = { forzarMayusculas: false, rowVersion: 'BBBB' }; service.updateSacramental(payload).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/sacramental`); expect(req.request.method).toBe('PUT'); expect(req.request.body).toEqual(payload); req.flush({ forzarMayusculas: false });
    });
});
