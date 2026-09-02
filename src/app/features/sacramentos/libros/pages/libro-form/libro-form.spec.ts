import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { LibroSacramentalApiService } from '../../data-access/libro-sacramental-api.service';
import { LibroSacramentalFormPage } from './libro-form';

describe('LibroSacramentalFormPage', () => {
    const api = { getTiposSacramento: vi.fn(() => of([{ idTipoSacramento: 1, codigo: 'BAUTISMO', nombre: 'Bautismo', orden: 10 }])), getEstadosFisicos: vi.fn(() => of([{ idEstadoLibroFisico: 1, codigo: 'DISPONIBLE', nombre: 'Disponible', orden: 10 }])), getById: vi.fn(), create: vi.fn(() => of({ idLibroSacramental: 7, rowVersion: 'A', mensaje: 'Libro creado' })), update: vi.fn() };
    const feedback = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
    beforeEach(() => { Object.values(api).forEach(mock => mock.mockClear()); TestBed.configureTestingModule({ imports: [LibroSacramentalFormPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } }, { provide: LibroSacramentalApiService, useValue: api }, { provide: FeedbackService, useValue: feedback }] }); });
    it('should validate folio sequence and create a book', () => { const fixture = TestBed.createComponent(LibroSacramentalFormPage); fixture.detectChanges(); fixture.componentInstance.form.setValue({ idTipoSacramento: 1, numeroLibro: '11', folioInicial: 1, folioFinal: 300, codigoEstadoFisico: 'DISPONIBLE', fechaAperturaFisica: null, fechaCierreFisica: null, ubicacionFisica: 'Archivo', observaciones: '' }); expect(fixture.componentInstance['validFolios']()).toBe(true); fixture.componentInstance['save'](); expect(api.create).toHaveBeenCalledWith(expect.objectContaining({ idTipoSacramento: 1, numeroLibro: '11', folioInicial: 1, folioFinal: 300, codigoEstadoFisico: 'DISPONIBLE' })); });
});
