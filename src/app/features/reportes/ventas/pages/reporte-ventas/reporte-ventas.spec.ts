import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { FileDownloadService } from '../../../../../core/files/file-download.service';
import { ReporteVentasApiService } from '../../data-access/reporte-ventas-api.service';
import { ReporteVentasResponse } from '../../data-access/reporte-ventas.models';
import { ReporteVentasPage } from './reporte-ventas';

describe('ReporteVentasPage', () => {
    const response: ReporteVentasResponse = {
        fechaInicio: '2026-09-01', fechaFin: '2026-09-30', cantidadVentas: 3, totalVendido: 120,
        ticketPromedio: 40, cantidadAnuladas: 1, totalAnulado: 20,
        metodosPago: [{ idMetodoPago: 1, nombreMetodoPago: 'Efectivo', cantidadVentas: 2, total: 80 }],
        tendenciaDiaria: [{ fecha: '2026-09-01', cantidadVentas: 3, total: 120 }],
        contenidos: [{ contenido: 'Servicios', cantidadVentas: 3, total: 120 }]
    };
    const api = { get: vi.fn(() => of(response)), exportExcel: vi.fn(() => of(new Blob(['excel']))), exportPdf: vi.fn(() => of(new Blob(['pdf']))) };
    const fileDownload = { download: vi.fn() };
    const feedback = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };

    beforeEach(() => {
        api.get.mockClear(); api.exportExcel.mockClear(); api.exportPdf.mockClear(); fileDownload.download.mockClear(); feedback.warning.mockClear(); feedback.error.mockClear(); feedback.success.mockClear();
        TestBed.configureTestingModule({
            imports: [ReporteVentasPage],
            providers: [
                { provide: ReporteVentasApiService, useValue: api },
                { provide: FileDownloadService, useValue: fileDownload },
                { provide: FeedbackService, useValue: feedback }
            ]
        });
    });

    it('should load the current month report on init', () => {
        const fixture = TestBed.createComponent(ReporteVentasPage);
        fixture.detectChanges();
        expect(api.get).toHaveBeenCalledTimes(1);
        expect(fixture.nativeElement.textContent).toContain('Reporte de ventas');
        expect(fixture.nativeElement.textContent).toContain('S/');
    });

    it('should apply the current day shortcut', () => {
        const fixture = TestBed.createComponent(ReporteVentasPage);
        fixture.detectChanges(); api.get.mockClear();
        const component = fixture.componentInstance as any;
        component.currentDay();
        const filters = component.filterForm.getRawValue();
        expect(filters.fechaInicio).toBe(filters.fechaFin);
        expect(api.get).toHaveBeenCalledWith({ fechaInicio: filters.fechaInicio, fechaFin: filters.fechaFin, tipoItem: null });
    });

    it('should apply date and content filters', () => {
        const fixture = TestBed.createComponent(ReporteVentasPage);
        fixture.detectChanges(); api.get.mockClear();
        const component = fixture.componentInstance as any;
        component.filterForm.setValue({ fechaInicio: '2026-08-01', fechaFin: '2026-08-31', tipoItem: 'SERVICIO' });
        component.search();
        expect(api.get).toHaveBeenCalledWith({ fechaInicio: '2026-08-01', fechaFin: '2026-08-31', tipoItem: 'SERVICIO' });
    });

    it('should reject an invalid date range without calling the api', () => {
        const fixture = TestBed.createComponent(ReporteVentasPage);
        fixture.detectChanges(); api.get.mockClear();
        const component = fixture.componentInstance as any;
        component.filterForm.setValue({ fechaInicio: '2026-09-30', fechaFin: '2026-09-01', tipoItem: null });
        component.search();
        expect(api.get).not.toHaveBeenCalled();
        expect(feedback.warning).toHaveBeenCalled();
    });

    it('should export Excel using the current report filters', () => {
        const fixture = TestBed.createComponent(ReporteVentasPage);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.exportExcel();
        expect(api.exportExcel).toHaveBeenCalledTimes(1);
        expect(fileDownload.download).toHaveBeenCalledOnce();
        expect(feedback.success).toHaveBeenCalled();
    });

    it('should export PDF using the current report filters', () => {
        const fixture = TestBed.createComponent(ReporteVentasPage);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.exportPdf();
        expect(api.exportPdf).toHaveBeenCalledTimes(1);
        expect(fileDownload.download).toHaveBeenCalledOnce();
        expect(feedback.success).toHaveBeenCalled();
    });

});
