import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { LibroSacramentalApiService } from '../../../libros/data-access/libro-sacramental-api.service';
import { SacramentalTextCaseService } from '../../../shared/sacramental-text-case.service';
import { MatrimonioApiService } from '../../data-access/matrimonio-api.service';
import { MatrimonioFormPage } from './matrimonio-form';

describe('MatrimonioFormPage', () => {
    const libros = { getTiposSacramento: vi.fn(() => of([{ idTipoSacramento: 3, codigo: 'MATRIMONIO', nombre: 'Matrimonio', orden: 3 }])), getList: vi.fn(() => of([])), getFolios: vi.fn(() => of([])), getById: vi.fn() };
    const api = { getSiguientePartida: vi.fn(), validatePartida: vi.fn(), create: vi.fn(), update: vi.fn(), getById: vi.fn() };
    beforeEach(() => TestBed.configureTestingModule({ imports: [MatrimonioFormPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}), queryParamMap: convertToParamMap({}) } } }, { provide: MatrimonioApiService, useValue: api }, { provide: LibroSacramentalApiService, useValue: libros }, { provide: FeedbackService, useValue: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }, { provide: MatDialog, useValue: { open: vi.fn() } }, { provide: SacramentalTextCaseService, useValue: { forzarMayusculas: () => true, ensureLoaded: vi.fn() } }] }));
    it('should expose two independent witness fields', () => { const fixture = TestBed.createComponent(MatrimonioFormPage); fixture.detectChanges(); expect(fixture.componentInstance.form.controls.testigo1).toBeDefined(); expect(fixture.componentInstance.form.controls.testigo2).toBeDefined(); expect(fixture.nativeElement.textContent).toContain('Testigo 1'); expect(fixture.nativeElement.textContent).toContain('Testigo 2'); });
});
