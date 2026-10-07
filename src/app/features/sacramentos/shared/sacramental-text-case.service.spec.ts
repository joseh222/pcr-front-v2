import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ConfiguracionApiService } from '../../configuracion/data-access/configuracion-api.service';
import { SacramentalTextCaseService } from './sacramental-text-case.service';

describe('SacramentalTextCaseService', () => {
    it('should load uppercase preference and allow updating it locally', () => {
        TestBed.configureTestingModule({ providers: [{ provide: ConfiguracionApiService, useValue: { getSacramental: vi.fn(() => of({ forzarMayusculas: false })) } }] });
        const service = TestBed.inject(SacramentalTextCaseService);
        service.ensureLoaded();
        expect(service.forzarMayusculas()).toBe(false);
        service.setForzarMayusculas(true);
        expect(service.forzarMayusculas()).toBe(true);
    });
});
