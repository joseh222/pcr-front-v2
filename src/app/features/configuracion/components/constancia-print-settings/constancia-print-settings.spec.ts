
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { ConstanciaApiService } from '../../../sacramentos/constancias/data-access/constancia-api.service';
import { ConstanciaPrintSettingsComponent } from './constancia-print-settings';

const CONFIG = { nombreParroquia: 'PARROQUIA CRISTO REY', lugarExpedicion: 'PUEBLO NUEVO', updatedUtc: null, updatedBy: null, rowVersion: 'AAAA' } as const;
const PRINTER = { modo: 'MANUAL', tipoConexion: 'USB', nombreImpresoraWindows: 'HP CONSTANCIAS', direccionIp: null, puerto: null, estaConfigurada: true, updatedUtc: null, updatedBy: null, rowVersion: 'DDDD' } as const;
const VALIDATION = { disponible: true, impresora: 'HP CONSTANCIAS', agente: 'PCR-PRINT-01', equipo: 'SECRETARIA', ultimoContactoUtc: '2026-09-03T23:00:00Z', mensaje: 'Impresora disponible.' } as const;
const TEMPLATE = {
    idConstanciaPlantilla: 1, idTipoSacramento: 1, codigoTipoSacramento: 'BAUTISMO', nombreTipoSacramento: 'Bautismo',
    anchoPapelMm: 210, altoPapelMm: 297, offsetGlobalXmm: 0, offsetGlobalYmm: 0, estaCalibrada: false, isActive: true,
    updatedUtc: null, updatedBy: null, rowVersion: 'BBBB',
    campos: [{ idConstanciaPlantillaCampo: 1, codigoCampo: 'PARROQUIA', etiqueta: 'Parroquia', xmm: 42, ymm: 76, anchoMm: 150, altoMm: 6, tamanoFuentePt: 10, alineacion: 'LEFT', maxLineas: 1, orden: 10, isActive: true, rowVersion: 'CCCC' }]
} as const;

describe('ConstanciaPrintSettingsComponent', () => {
    const api = {
        getConfiguracion: vi.fn(() => of(CONFIG)),
        updateConfiguracion: vi.fn(() => of(CONFIG)),
        getImpresora: vi.fn(() => of(PRINTER)),
        updateImpresora: vi.fn(() => of({ configuracion: PRINTER, plantillasDescalibradas: 0, mensaje: 'OK' })),
        validarImpresora: vi.fn(() => of(VALIDATION)),
        getPlantilla: vi.fn(() => of(TEMPLATE)),
        updatePlantilla: vi.fn(() => of(TEMPLATE)),
        abrirCalibracion: vi.fn(() => of(TEMPLATE)),
        marcarCalibrada: vi.fn(() => of({ ...TEMPLATE, estaCalibrada: true })),
        getPruebaPdf: vi.fn(() => of(new Blob())),
        imprimirPrueba: vi.fn(() => of({ idTrabajo: 100, tipoDocumento: 'CONSTANCIA_PRUEBA', estado: 'PENDIENTE', impresora: 'HP CONSTANCIAS', cantidadCopias: 1, codigo: 'QUEUED', mensaje: 'OK' })),
        getTrabajoEstado: vi.fn(() => of({ idTrabajo: 100, tipoDocumento: 'CONSTANCIA_PRUEBA', entidadOrigen: 'CONSTANCIA_PLANTILLA', idOrigen: 1, codigoReferencia: 'BAUTISMO', numeroSolicitud: 1, modoImpresion: 'MANUAL', impresora: 'HP CONSTANCIAS', estado: 'COMPLETADO', intentos: 1, maxIntentos: 3, cantidadCopias: 1, fechaCreacionUtc: '', fechaActualizacionUtc: '', fechaFinalizacionUtc: '', ultimoDetalle: null, rowVersion: 'EEEE' }))
    };

    beforeEach(() => {
        vi.clearAllMocks();
        TestBed.configureTestingModule({
            imports: [ConstanciaPrintSettingsComponent],
            providers: [
                { provide: ConstanciaApiService, useValue: api },
                { provide: AuthStore, useValue: { hasPermission: vi.fn(() => true) } },
                { provide: FeedbackService, useValue: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }
            ]
        });
    });

    it('should load general configuration, dedicated printer and baptism template', () => {
        const fixture = TestBed.createComponent(ConstanciaPrintSettingsComponent);
        fixture.detectChanges();

        expect(api.getConfiguracion).toHaveBeenCalled();
        expect(api.getImpresora).toHaveBeenCalled();
        expect(api.getPlantilla).toHaveBeenCalledWith('BAUTISMO');
        expect(fixture.nativeElement.textContent).toContain('PUEBLO NUEVO');
        expect(fixture.nativeElement.textContent).toContain('HP CONSTANCIAS');
        expect(fixture.nativeElement.textContent).toContain('Offset global X');
        expect(fixture.nativeElement.textContent).toContain('PENDIENTE DE CALIBRACIÓN');
    });
});
