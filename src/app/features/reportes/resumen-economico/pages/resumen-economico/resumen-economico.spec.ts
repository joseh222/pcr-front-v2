import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { FileDownloadService } from '../../../../../core/files/file-download.service';
import { ResumenEconomicoApiService } from '../../data-access/resumen-economico-api.service';
import { ResumenEconomicoResponse } from '../../data-access/resumen-economico.models';
import { ResumenEconomicoPage } from './resumen-economico';

describe('ResumenEconomicoPage', () => {
    const response: ResumenEconomicoResponse = {
        fechaInicio: '2026-08-01', fechaFin: '2026-08-31', cantidadVentas: 5, totalIngresos: 300, cantidadCompras: 2, totalEgresos: 120, saldoPeriodo: 180, saldoSobreIngresosPorcentaje: 60,
        metodosPago: [{ idMetodoPago: 1, nombreMetodoPago: 'Efectivo', cantidadVentas: 5, totalIngresos: 300 }],
        flujoDiario: [{ fecha: '2026-08-15', ingresos: 100, egresos: 40, saldo: 60 }],
        composicionVentas: [{ tipoItem: 'SERVICIO', cantidadVentas: 3, cantidadItems: 3, totalDetalle: 150 }]
    };
    const api = { get: vi.fn(() => of(response)), exportExcel: vi.fn(() => of(new Blob(['excel']))), exportPdf: vi.fn(() => of(new Blob(['pdf']))) };
    const fileDownload = { download: vi.fn() };
    const feedback = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };

    beforeEach(() => {
        api.get.mockClear(); api.exportExcel.mockClear(); api.exportPdf.mockClear(); fileDownload.download.mockClear(); feedback.warning.mockClear(); feedback.error.mockClear(); feedback.success.mockClear();
        TestBed.configureTestingModule({ imports: [ResumenEconomicoPage], providers: [{ provide: ResumenEconomicoApiService, useValue: api }, { provide: FileDownloadService, useValue: fileDownload }, { provide: FeedbackService, useValue: feedback }] });
    });

    it('should load the current month summary on init', () => {
        const fixture = TestBed.createComponent(ResumenEconomicoPage);
        fixture.detectChanges();
        expect(api.get).toHaveBeenCalledTimes(1);
        expect(fixture.nativeElement.textContent).toContain('Resumen económico');
        expect(fixture.nativeElement.textContent).toContain('Efectivo');
    });

    it('should apply the current day shortcut', () => {
        const fixture = TestBed.createComponent(ResumenEconomicoPage);
        fixture.detectChanges(); api.get.mockClear();
        const component = fixture.componentInstance as any;
        component.currentDay();
        const filters = component.filterForm.getRawValue();
        expect(filters.fechaInicio).toBe(filters.fechaFin);
        expect(api.get).toHaveBeenCalledWith({ fechaInicio: filters.fechaInicio, fechaFin: filters.fechaFin });
    });

    it('should reject an invalid date range without calling the api', () => {
        const fixture = TestBed.createComponent(ResumenEconomicoPage);
        fixture.detectChanges(); api.get.mockClear();
        const component = fixture.componentInstance as any;
        component.filterForm.setValue({ fechaInicio: '2026-09-30', fechaFin: '2026-09-01' });
        component.search();
        expect(api.get).not.toHaveBeenCalled();
        expect(feedback.warning).toHaveBeenCalled();
    });

    it('should export Excel using the current report filters', () => {
        const fixture = TestBed.createComponent(ResumenEconomicoPage);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.exportExcel();
        expect(api.exportExcel).toHaveBeenCalledTimes(1);
        expect(fileDownload.download).toHaveBeenCalledOnce();
        expect(feedback.success).toHaveBeenCalled();
    });

    it('should export PDF using the current report filters', () => {
        const fixture = TestBed.createComponent(ResumenEconomicoPage);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.exportPdf();
        expect(api.exportPdf).toHaveBeenCalledTimes(1);
        expect(fileDownload.download).toHaveBeenCalledOnce();
        expect(feedback.success).toHaveBeenCalled();
    });

});
