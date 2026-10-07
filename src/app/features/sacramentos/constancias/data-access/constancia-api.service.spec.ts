
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ConstanciaApiService } from './constancia-api.service';

describe('ConstanciaApiService', () => {
    let service: ConstanciaApiService;
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl: 'https://api.test/api' } } }
            ]
        });
        service = TestBed.inject(ConstanciaApiService);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('should get dedicated certificate printer configuration', () => {
        service.getImpresora().subscribe();
        const req = http.expectOne('https://api.test/api/Constancia/impresora');
        expect(req.request.method).toBe('GET');
        req.flush({});
    });

    it('should validate printer through Print Agent heartbeat', () => {
        service.validarImpresora().subscribe();
        const req = http.expectOne('https://api.test/api/Constancia/impresora/validar');
        expect(req.request.method).toBe('GET');
        req.flush({ disponible: true });
    });

    it('should open calibration explicitly', () => {
        service.abrirCalibracion('BAUTISMO', { rowVersion: 'AAAA' }).subscribe();
        const req = http.expectOne('https://api.test/api/Constancia/plantillas/BAUTISMO/calibracion/abrir');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ rowVersion: 'AAAA' });
        req.flush({});
    });

    it('should mark calibration explicitly', () => {
        service.marcarCalibrada('MATRIMONIO', { rowVersion: 'BBBB' }).subscribe();
        const req = http.expectOne('https://api.test/api/Constancia/plantillas/MATRIMONIO/calibracion/marcar');
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('should enqueue a physical test sheet', () => {
        service.imprimirPrueba('BAUTISMO').subscribe();
        const req = http.expectOne('https://api.test/api/Constancia/plantillas/BAUTISMO/prueba/imprimir');
        expect(req.request.method).toBe('POST');
        req.flush({ idTrabajo: 100, estado: 'PENDIENTE' });
    });

    it('should enqueue a physical certificate print', () => {
        service.imprimir(25, 3).subscribe();
        const req = http.expectOne('https://api.test/api/Constancia/solicitudes/25/imprimir');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ cantidad: 3 });
        req.flush({ idTrabajo: 101, estado: 'PENDIENTE' });
    });

    it('should get physical print job status', () => {
        service.getTrabajoEstado(101).subscribe();
        const req = http.expectOne('https://api.test/api/Constancia/trabajos/101');
        expect(req.request.method).toBe('GET');
        req.flush({ idTrabajo: 101, estado: 'COMPLETADO' });
    });
});
