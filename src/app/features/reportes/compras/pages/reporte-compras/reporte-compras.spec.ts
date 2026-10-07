import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { FileDownloadService } from '../../../../../core/files/file-download.service';
import { ReporteComprasApiService } from '../../data-access/reporte-compras-api.service';
import { ReporteComprasResponse } from '../../data-access/reporte-compras.models';
import { ReporteComprasPage } from './reporte-compras';

describe('ReporteComprasPage', () => {
    const response: ReporteComprasResponse = {
        fechaInicio: '2026-09-01', fechaFin: '2026-09-30', cantidadCompras: 2, totalComprado: 150, compraPromedio: 75, cantidadAnuladas: 1, totalAnulado: 20,
        proveedores: [{ idProveedor: 1, nombreProveedor: 'Proveedor prueba', cantidadCompras: 2, total: 150 }],
        tendenciaDiaria: [{ fecha: '2026-09-01', cantidadCompras: 2, total: 150 }],
        productos: [{ idProducto: 1, codigoProducto: 'P001', descripcionProducto: 'Producto prueba', cantidad: 3, total: 150 }]
    };
    const api = { get: vi.fn(() => of(response)), exportExcel: vi.fn(() => of(new Blob(['excel']))), exportPdf: vi.fn(() => of(new Blob(['pdf']))) };
    const fileDownload = { download: vi.fn() };
    const feedback = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };

    beforeEach(() => {
        api.get.mockClear(); api.exportExcel.mockClear(); api.exportPdf.mockClear(); fileDownload.download.mockClear(); feedback.warning.mockClear(); feedback.error.mockClear(); feedback.success.mockClear();
        TestBed.configureTestingModule({ imports: [ReporteComprasPage], providers: [{ provide: ReporteComprasApiService, useValue: api }, { provide: FileDownloadService, useValue: fileDownload }, { provide: FeedbackService, useValue: feedback }] });
    });

    it('should load the current month report on init', () => {
        const fixture = TestBed.createComponent(ReporteComprasPage);
        fixture.detectChanges();
        expect(api.get).toHaveBeenCalledTimes(1);
        expect(fixture.nativeElement.textContent).toContain('Reporte de compras');
        expect(fixture.nativeElement.textContent).toContain('Proveedor prueba');
    });

    it('should apply the current day shortcut', () => {
        const fixture = TestBed.createComponent(ReporteComprasPage);
        fixture.detectChanges(); api.get.mockClear();
        const component = fixture.componentInstance as any;
        component.currentDay();
        const filters = component.filterForm.getRawValue();
        expect(filters.fechaInicio).toBe(filters.fechaFin);
        expect(api.get).toHaveBeenCalledWith({ fechaInicio: filters.fechaInicio, fechaFin: filters.fechaFin });
    });

    it('should reject an invalid date range without calling the api', () => {
        const fixture = TestBed.createComponent(ReporteComprasPage);
        fixture.detectChanges(); api.get.mockClear();
        const component = fixture.componentInstance as any;
        component.filterForm.setValue({ fechaInicio: '2026-09-30', fechaFin: '2026-09-01' });
        component.search();
        expect(api.get).not.toHaveBeenCalled();
        expect(feedback.warning).toHaveBeenCalled();
    });

    it('should export Excel using the current report filters', () => {
        const fixture = TestBed.createComponent(ReporteComprasPage);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.exportExcel();
        expect(api.exportExcel).toHaveBeenCalledTimes(1);
        expect(fileDownload.download).toHaveBeenCalledOnce();
        expect(feedback.success).toHaveBeenCalled();
    });

    it('should export PDF using the current report filters', () => {
        const fixture = TestBed.createComponent(ReporteComprasPage);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.exportPdf();
        expect(api.exportPdf).toHaveBeenCalledTimes(1);
        expect(fileDownload.download).toHaveBeenCalledOnce();
        expect(feedback.success).toHaveBeenCalled();
    });

});
