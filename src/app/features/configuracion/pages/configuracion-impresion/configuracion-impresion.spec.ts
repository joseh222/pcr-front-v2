import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ConfiguracionApiService } from '../../data-access/configuracion-api.service';
import { ConfiguracionImpresionPage } from './configuracion-impresion';

const CONFIG = { modo: 'MANUAL', motor: 'PRINT_AGENT', tipoConexion: 'RED', nombreImpresoraWindows: '80mm Series Printer', direccionIp: '192.168.1.114', puerto: 9100, anchoPapelMm: 80, imprimirTicketVenta: true, imprimirDocumentosAsociados: true, cortarEntreDocumentos: true, isActive: true, updatedUtc: null, updatedBy: null, rowVersion: 'AAAA' } as const;
describe('ConfiguracionImpresionPage', () => {
    const api = { getImpresion: vi.fn(() => of(CONFIG)), updateImpresion: vi.fn(() => of({ ...CONFIG, modo: 'AUTOMATICO' as const, rowVersion: 'BBBB' })) };
    beforeEach(() => TestBed.configureTestingModule({ imports: [ConfiguracionImpresionPage], providers: [{ provide: ConfiguracionApiService, useValue: api }, { provide: AuthStore, useValue: { hasPermission: vi.fn(() => true) } }, { provide: FeedbackService, useValue: { success: vi.fn(), error: vi.fn() } }] }));
    it('should load global print configuration', () => { const fixture = TestBed.createComponent(ConfiguracionImpresionPage); fixture.detectChanges(); expect(api.getImpresion).toHaveBeenCalled(); expect(fixture.nativeElement.textContent).toContain('80mm Series Printer'); });
});
