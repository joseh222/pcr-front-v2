import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { SacramentalTextCaseService } from '../../../sacramentos/shared/sacramental-text-case.service';
import { ConfiguracionApiService } from '../../data-access/configuracion-api.service';
import { ConfiguracionImpresionPage } from './configuracion-impresion';

const PRINT = { modo: 'MANUAL', motor: 'PRINT_AGENT', tipoConexion: 'RED', nombreImpresoraWindows: '80mm Series Printer', direccionIp: '192.168.1.114', puerto: 9100, anchoPapelMm: 80, imprimirTicketVenta: true, imprimirDocumentosAsociados: true, cortarEntreDocumentos: true, isActive: true, updatedUtc: null, updatedBy: null, rowVersion: 'AAAA' } as const;
const SACRAMENTAL = { forzarMayusculas: true, updatedUtc: null, updatedBy: null, rowVersion: 'BBBB' } as const;
describe('ConfiguracionImpresionPage', () => {
    const api = { getImpresion: vi.fn(() => of(PRINT)), updateImpresion: vi.fn(() => of(PRINT)), getSacramental: vi.fn(() => of(SACRAMENTAL)), updateSacramental: vi.fn(() => of({ ...SACRAMENTAL, forzarMayusculas: false, rowVersion: 'CCCC' })) };
    const textCase = { setForzarMayusculas: vi.fn() };
    beforeEach(() => { vi.clearAllMocks(); TestBed.configureTestingModule({ imports: [ConfiguracionImpresionPage], providers: [{ provide: ConfiguracionApiService, useValue: api }, { provide: AuthStore, useValue: { hasPermission: vi.fn(() => true) } }, { provide: FeedbackService, useValue: { success: vi.fn(), error: vi.fn() } }, { provide: SacramentalTextCaseService, useValue: textCase }] }); });
    it('should load print and sacramental configuration', () => { const fixture = TestBed.createComponent(ConfiguracionImpresionPage); fixture.detectChanges(); expect(api.getImpresion).toHaveBeenCalled(); expect(api.getSacramental).toHaveBeenCalled(); expect(fixture.nativeElement.textContent).toContain('80mm Series Printer'); expect(fixture.nativeElement.textContent).toContain('Forzar texto en mayúsculas'); expect(textCase.setForzarMayusculas).toHaveBeenCalledWith(true); });
});
