import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthStore } from '../../../../auth/data-access/auth.store';
import { LibroSacramentalApiService } from '../../data-access/libro-sacramental-api.service';
import { LibroSacramentalListPage } from './libro-list';

describe('LibroSacramentalListPage', () => {
    const api = { getTiposSacramento: vi.fn(() => of([{ idTipoSacramento: 1, codigo: 'BAUTISMO', nombre: 'Bautismo', orden: 10 }])), getEstadosFisicos: vi.fn(() => of([{ idEstadoLibroFisico: 3, codigo: 'CERRADO', nombre: 'Cerrado', orden: 30 }])), getEstadosDigitalizacion: vi.fn(() => of([{ idEstadoDigitalizacion: 1, codigo: 'PENDIENTE', nombre: 'Pendiente', orden: 10 }])), getList: vi.fn(() => of([{ idLibroSacramental: 7, idTipoSacramento: 1, codigoTipoSacramento: 'BAUTISMO', tipoSacramento: 'Bautismo', numeroLibro: '11', folioInicial: 1, folioFinal: 300, cantidadFolios: 300, idEstadoLibroFisico: 3, codigoEstadoFisico: 'CERRADO', estadoFisico: 'Cerrado', idEstadoDigitalizacion: 1, codigoEstadoDigitalizacion: 'PENDIENTE', estadoDigitalizacion: 'Pendiente', fechaAperturaFisica: null, fechaCierreFisica: null, ubicacionFisica: 'Archivo', observaciones: null, digitalizacionIniciadaUtc: null, digitalizacionCompletadaUtc: null, digitalizacionReabiertaUtc: null, isActive: true, createdUtc: '2026-09-02T00:00:00Z', updatedUtc: null, foliosGenerados: 300, rowVersion: 'A' }])) };
    const auth = { hasPermission: vi.fn(() => true), permissions: signal<readonly string[]>([]), grantsAllPermissions: signal(true) };
    beforeEach(() => { Object.values(api).forEach(mock => mock.mockClear()); TestBed.configureTestingModule({ imports: [LibroSacramentalListPage], providers: [provideRouter([]), { provide: LibroSacramentalApiService, useValue: api }, { provide: AuthStore, useValue: auth }] }); });
    it('should load and display sacramental books', () => { const fixture = TestBed.createComponent(LibroSacramentalListPage); fixture.detectChanges(); expect(api.getList).toHaveBeenCalled(); expect(fixture.nativeElement.textContent).toContain('Libros sacramentales'); expect(fixture.nativeElement.textContent).toContain('Bautismo · Libro 11'); expect(fixture.nativeElement.textContent).toContain('300 generados'); });
});
