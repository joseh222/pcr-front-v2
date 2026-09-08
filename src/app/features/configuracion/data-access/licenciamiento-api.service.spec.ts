import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { LicenciamientoApiService } from './licenciamiento-api.service';

describe('LicenciamientoApiService', () => {
    const apiBaseUrl='https://localhost:9001/api';
    let service:LicenciamientoApiService;
    let http:HttpTestingController;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            providers:[
                provideHttpClient(), provideHttpClientTesting(),
                {provide:RuntimeConfigService,useValue:{config:{apiBaseUrl}}}
            ]
        });
        service=TestBed.inject(LicenciamientoApiService);
        http=TestBed.inject(HttpTestingController);
    });

    afterEach(()=>http.verify());

    it('consulta estado, solicitud e historial',()=>{
        service.getStatus().subscribe(); let req=http.expectOne(`${apiBaseUrl}/Licensing/status`); expect(req.request.method).toBe('GET'); req.flush({modulos:[]});
        service.getRequest().subscribe(); req=http.expectOne(`${apiBaseUrl}/Licensing/request`); expect(req.request.method).toBe('GET'); req.flush({modules:[]});
        service.getHistory().subscribe(); req=http.expectOne(`${apiBaseUrl}/Licensing/history`); expect(req.request.method).toBe('GET'); req.flush([]);
    });

    it('activa una licencia enviando el contenido exacto',()=>{
        const contenido='{"schemaVersion":1}';
        service.activate(contenido).subscribe();
        const req=http.expectOne(`${apiBaseUrl}/Licensing/activate`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({contenidoLicencia:contenido});
        req.flush({exito:true,codigo:'ACTIVATED',mensaje:'OK',estado:{modulos:[]}});
    });
});
