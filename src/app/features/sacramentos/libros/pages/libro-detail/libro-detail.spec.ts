import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthStore } from '../../../../auth/data-access/auth.store';
import { LibroSacramentalActionsService } from '../../data-access/libro-sacramental-actions.service';
import { LibroSacramentalApiService } from '../../data-access/libro-sacramental-api.service';
import { LibroSacramentalDetailPage } from './libro-detail';

describe('LibroSacramentalDetailPage', () => {
    const detail: any = { idLibroSacramental: 7, idTipoSacramento: 1, codigoTipoSacramento: 'BAUTISMO', tipoSacramento: 'Bautismo', numeroLibro: '11', folioInicial: 1, folioFinal: 120, cantidadFolios: 120, idEstadoLibroFisico: 3, codigoEstadoFisico: 'CERRADO', estadoFisico: 'Cerrado', idEstadoDigitalizacion: 2, codigoEstadoDigitalizacion: 'EN_PROCESO', estadoDigitalizacion: 'En proceso', fechaAperturaFisica: null, fechaCierreFisica: null, ubicacionFisica: 'Archivo', observaciones: null, digitalizacionIniciadaUtc: null, digitalizacionCompletadaUtc: null, digitalizacionReabiertaUtc: null, isActive: true, createdUtc: '2026-09-02T00:00:00Z', updatedUtc: null, foliosGenerados: 120, rowVersion: 'A', digitalizacionIniciadaById: 1, digitalizacionCompletadaById: null, digitalizacionReabiertaById: null, createdById: 1, updatedById: null };
    const folios = Array.from({ length: 120 }, (_, i) => ({ idFolioSacramental: i + 1, idLibroSacramental: 7, numeroLibro: '11', numeroFolio: String(i + 1), ordenFolio: i + 1, isActive: true, rowVersion: 'A' }));
    const api = { getById: vi.fn(() => of(detail)), getFolios: vi.fn(() => of(folios)) }; const actions = { changePhysicalStatus: vi.fn(() => of(false)), changeDigitizationStatus: vi.fn(() => of(false)), reopenDigitization: vi.fn(() => of(false)) }; const auth = { hasPermission: vi.fn(() => true), permissions: signal<readonly string[]>([]), grantsAllPermissions: signal(true) };
    beforeEach(() => { api.getById.mockClear(); api.getFolios.mockClear(); TestBed.configureTestingModule({ imports: [LibroSacramentalDetailPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '7' }) } } }, { provide: LibroSacramentalApiService, useValue: api }, { provide: LibroSacramentalActionsService, useValue: actions }, { provide: AuthStore, useValue: auth }] }); });
    it('should render the book and paginate folios', () => { const fixture = TestBed.createComponent(LibroSacramentalDetailPage); fixture.detectChanges(); expect(api.getById).toHaveBeenCalledWith(7); expect(api.getFolios).toHaveBeenCalledWith(7, undefined); expect(fixture.nativeElement.textContent).toContain('Bautismo · Libro 11'); expect(fixture.nativeElement.textContent).toContain('Página 1 de 2'); expect(fixture.nativeElement.querySelectorAll('.folio-button').length).toBe(60); });
});
