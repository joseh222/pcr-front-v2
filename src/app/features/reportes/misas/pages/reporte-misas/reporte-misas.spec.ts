import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { FileDownloadService } from '../../../../../core/files/file-download.service';
import { ReporteMisasApiService } from '../../data-access/reporte-misas-api.service';
import { ReporteMisasResponse } from '../../data-access/reporte-misas.models';
import { ReporteMisasPage } from './reporte-misas';

describe('ReporteMisasPage', () => {
    const response: ReporteMisasResponse = {
        fechaInicio: '2026-08-01', fechaFin: '2026-08-31', cantidadMisas: 8, cantidadPagadas: 5, montoPagado: 125, cantidadPendientesPago: 2, montoPendiente: 40, cantidadNoRequierenPago: 1, cantidadCelebradas: 4, cantidadSinSolicitud: 0,
        modalidades: [{ idModalidad: 1, nombreModalidad: 'Personal', cantidadMisas: 5 }],
        tipos: [{ idTipo: 2, codigoTipo: 'DIFUNTO', nombreTipo: 'Difunto', cantidadMisas: 4 }],
        estados: [{ idEstado: 1, nombreEstado: 'Programada', cantidadMisas: 4 }],
        estadosPago: [{ estadoPago: 'PAGADO', nombreEstadoPago: 'Pagado', cantidadMisas: 5, importe: 125 }],
        tendenciaDiaria: [{ fecha: '2026-08-15', cantidadMisas: 3, cantidadPagadas: 2, montoPagado: 50 }]
    };
    const api = { get: vi.fn(() => of(response)), exportExcel: vi.fn(() => of(new Blob(['excel']))), exportPdf: vi.fn(() => of(new Blob(['pdf']))) };
    const fileDownload = { download: vi.fn() };
    const feedback = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };

    beforeEach(() => {
        api.get.mockClear(); api.exportExcel.mockClear(); api.exportPdf.mockClear(); fileDownload.download.mockClear(); feedback.warning.mockClear(); feedback.error.mockClear(); feedback.success.mockClear();
        TestBed.configureTestingModule({ imports: [ReporteMisasPage], providers: [{ provide: ReporteMisasApiService, useValue: api }, { provide: FileDownloadService, useValue: fileDownload }, { provide: FeedbackService, useValue: feedback }] });
    });

    it('should load the current month report on init', () => {
        const fixture = TestBed.createComponent(ReporteMisasPage);
        fixture.detectChanges();
        expect(api.get).toHaveBeenCalledTimes(1);
        expect(fixture.nativeElement.textContent).toContain('Reporte de misas');
        expect(fixture.nativeElement.textContent).toContain('Personal');
    });

    it('should apply the current day shortcut and clear optional filters', () => {
        const fixture = TestBed.createComponent(ReporteMisasPage);
        fixture.detectChanges(); api.get.mockClear();
        const component = fixture.componentInstance as any;
        component.filterForm.patchValue({ idModalidad: 1, estadoPago: 'PAGADO' });
        component.currentDay();
        const filters = component.filterForm.getRawValue();
        expect(filters.fechaInicio).toBe(filters.fechaFin);
        expect(filters.idModalidad).toBeNull();
        expect(filters.estadoPago).toBeNull();
        expect(api.get).toHaveBeenCalled();
    });

    it('should reject an invalid date range without calling the api', () => {
        const fixture = TestBed.createComponent(ReporteMisasPage);
        fixture.detectChanges(); api.get.mockClear();
        const component = fixture.componentInstance as any;
        component.filterForm.patchValue({ fechaInicio: '2026-09-30', fechaFin: '2026-09-01' });
        component.search();
        expect(api.get).not.toHaveBeenCalled();
        expect(feedback.warning).toHaveBeenCalled();
    });

    it('should export Excel using the current report filters', () => {
        const fixture = TestBed.createComponent(ReporteMisasPage);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.exportExcel();
        expect(api.exportExcel).toHaveBeenCalledTimes(1);
        expect(fileDownload.download).toHaveBeenCalledOnce();
        expect(feedback.success).toHaveBeenCalled();
    });

    it('should export PDF using the current report filters', () => {
        const fixture = TestBed.createComponent(ReporteMisasPage);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.exportPdf();
        expect(api.exportPdf).toHaveBeenCalledTimes(1);
        expect(fileDownload.download).toHaveBeenCalledOnce();
        expect(feedback.success).toHaveBeenCalled();
    });

});
