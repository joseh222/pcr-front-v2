import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { ConstanciaApiService } from '../../../sacramentos/constancias/data-access/constancia-api.service';
import { SacramentalTextCaseService } from '../../../sacramentos/shared/sacramental-text-case.service';
import { ConfiguracionApiService } from '../../data-access/configuracion-api.service';
import { ConfiguracionImpresionPage } from './configuracion-impresion';
import { ModuleStore } from '../../data-access/module.store';
import { MODULE_CODE } from '../../../../core/licensing/module-code.model';

const PRINT = { modo: 'MANUAL', motor: 'PRINT_AGENT', tipoConexion: 'RED', nombreImpresoraWindows: '80mm Series Printer', direccionIp: '192.168.1.114', puerto: 9100, anchoPapelMm: 80, imprimirTicketVenta: true, imprimirDocumentosAsociados: true, cortarEntreDocumentos: true, isActive: true, updatedUtc: null, updatedBy: null, rowVersion: 'AAAA' } as const;
const QUEUE = { colaHabilitada: false, maxAntiguedadAutomaticaMinutos: 10, maxAntiguedadManualMinutos: 60, updatedUtc: null, updatedBy: null, rowVersion: 'QQQQ' } as const;
const QUEUE_SUMMARY = { colaHabilitada: false, maxAntiguedadAutomaticaMinutos: 10, maxAntiguedadManualMinutos: 60, pendientes: 3, pendientesVencidos: 1, procesando: 0, errores: 2, pendienteMasAntiguoUtc: null } as const;
const SACRAMENTAL = { forzarMayusculas: true, updatedUtc: null, updatedBy: null, rowVersion: 'BBBB' } as const;
const CONSTANCIA_CONFIG = { nombreParroquia: 'PARROQUIA CRISTO REY', lugarExpedicion: 'PUEBLO NUEVO', updatedUtc: null, updatedBy: null, rowVersion: 'CCCC' } as const;
const TEMPLATE = { idConstanciaPlantilla: 1, idTipoSacramento: 1, codigoTipoSacramento: 'BAUTISMO', nombreTipoSacramento: 'Bautismo', anchoPapelMm: 210, altoPapelMm: 297, offsetGlobalXmm: 0, offsetGlobalYmm: 0, estaCalibrada: false, isActive: true, updatedUtc: null, updatedBy: null, rowVersion: 'DDDD', campos: [{ idConstanciaPlantillaCampo: 1, codigoCampo: 'PARROQUIA', etiqueta: 'Parroquia', xmm: 42, ymm: 76, anchoMm: 150, altoMm: 6, tamanoFuentePt: 10, alineacion: 'LEFT', maxLineas: 1, orden: 10, isActive: true, rowVersion: 'EEEE' }] } as const;

describe('ConfiguracionImpresionPage', () => {
    const api = {
        getImpresion: vi.fn(() => of(PRINT)), updateImpresion: vi.fn(() => of(PRINT)),
        getColaImpresion: vi.fn(() => of(QUEUE)), updateColaImpresion: vi.fn(() => of(QUEUE)),
        getResumenColaImpresion: vi.fn(() => of(QUEUE_SUMMARY)), cancelarPendientesColaImpresion: vi.fn(() => of({ cantidadCancelada: 3, mensaje: 'Cancelados' })),
        getSacramental: vi.fn(() => of(SACRAMENTAL)), updateSacramental: vi.fn(() => of({ ...SACRAMENTAL, forzarMayusculas: false, rowVersion: 'CCCC' }))
    };
    const constanciaApi = { getConfiguracion: vi.fn(() => of(CONSTANCIA_CONFIG)), updateConfiguracion: vi.fn(() => of(CONSTANCIA_CONFIG)), getPlantilla: vi.fn(() => of(TEMPLATE)), updatePlantilla: vi.fn(() => of(TEMPLATE)), getPruebaPdf: vi.fn(() => of(new Blob())) };
    const textCase = { setForzarMayusculas: vi.fn() };

    beforeEach(() => {
        vi.clearAllMocks();
        TestBed.configureTestingModule({
            imports: [ConfiguracionImpresionPage],
            providers: [
                { provide: ConfiguracionApiService, useValue: api },
                { provide: ConstanciaApiService, useValue: constanciaApi },
                { provide: AuthStore, useValue: { hasPermission: vi.fn((_code: string) => true) } },
                { provide: FeedbackService, useValue: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } },
                { provide: SacramentalTextCaseService, useValue: textCase },
                { provide: ModuleStore, useValue: { isEnabled: () => true } }
            ]
        });
    });

    it('should load queue, print, sacramental and constancia configuration', () => {
        const fixture = TestBed.createComponent(ConfiguracionImpresionPage);
        fixture.detectChanges();
        expect(api.getColaImpresion).toHaveBeenCalled();
        expect(api.getResumenColaImpresion).toHaveBeenCalled();
        expect(api.getImpresion).toHaveBeenCalled();
        expect(api.getSacramental).toHaveBeenCalled();
        expect(constanciaApi.getConfiguracion).toHaveBeenCalled();
        expect(fixture.nativeElement.textContent).toContain('COLA PAUSADA');
        expect(fixture.nativeElement.textContent).toContain('80mm Series Printer');
        expect(fixture.nativeElement.textContent).toContain('Forzar texto en mayúsculas');
        expect(fixture.nativeElement.textContent).toContain('Impresión de constancias');
        expect(textCase.setForzarMayusculas).toHaveBeenCalledWith(true);
    });


    it('should not load or render sacramental configuration when SACRAMENTOS is not licensed', () => {
        TestBed.resetTestingModule();
        vi.clearAllMocks();
        TestBed.configureTestingModule({
            imports: [ConfiguracionImpresionPage],
            providers: [
                { provide: ConfiguracionApiService, useValue: api },
                { provide: ConstanciaApiService, useValue: constanciaApi },
                { provide: AuthStore, useValue: { hasPermission: vi.fn((_code: string) => true) } },
                { provide: FeedbackService, useValue: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } },
                { provide: SacramentalTextCaseService, useValue: textCase },
                { provide: ModuleStore, useValue: { isEnabled: (code: string) => code !== MODULE_CODE.SACRAMENTS } }
            ]
        });
        const fixture = TestBed.createComponent(ConfiguracionImpresionPage);
        fixture.detectChanges();
        expect(api.getSacramental).not.toHaveBeenCalled();
        expect(constanciaApi.getConfiguracion).not.toHaveBeenCalled();
        expect(fixture.nativeElement.textContent).not.toContain('Registros sacramentales');
        expect(fixture.nativeElement.textContent).not.toContain('Impresión de constancias');
    });

});
