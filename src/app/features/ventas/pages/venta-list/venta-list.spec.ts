import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VentaListStore } from '../../data-access/models/venta-list.store';
import { VentaListPage } from './venta-list';
import { of } from 'rxjs';
import { VentaCancellationService } from '../../data-access/venta-cancellation.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { VentaApiService } from '../../data-access/venta-api.service';
import { FileDownloadService } from '../../../../core/files/file-download.service';
import { FeedbackService } from '../../../../core/feedback/feedback.service';

const authStoreMock = { hasPermission: vi.fn(() => true) };

describe('VentaListPage', () => {
    const loading = signal(false);
    const error = signal<string | null>(null);
    const catalogsError = signal<string | null>(null);
    const items = signal<any[]>([]);
    const totalRegistros = signal(0);
    const pagina = signal(1);
    const tamanoPagina = signal(20);
    const query = signal<any>({ fechaInicio: null, fechaFin: null, idMetodoPago: null, idTipoComprobante: null, tipoItem: null, texto: null, pagina: 1, tamanoPagina: 20 });

    const cancellationMock = {
        cancel: vi.fn(() => of({ idVenta: 1 }))
    };

    const apiMock = { exportExcel: vi.fn(() => of(new Blob(['xlsx']))), exportPdf: vi.fn(() => of(new Blob(['pdf'], { type: 'application/pdf' }))) };
    const fileDownloadMock = { download: vi.fn() };
    const feedbackMock = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };

    const storeMock = {
        query: query.asReadonly(),
        loading: loading.asReadonly(),
        error: error.asReadonly(),
        catalogsError: catalogsError.asReadonly(),
        metodosPago: signal<any[]>([]).asReadonly(),
        tiposComprobante: signal<any[]>([]).asReadonly(),
        items: items.asReadonly(),
        totalRegistros: totalRegistros.asReadonly(),
        pagina: pagina.asReadonly(),
        tamanoPagina: tamanoPagina.asReadonly(),
        isEmpty: () => !loading() && !error() && items().length === 0,
        loadCatalogs: vi.fn(),
        load: vi.fn(),
        search: vi.fn(),
        resetFilters: vi.fn(),
        reload: vi.fn(),
        changePage: vi.fn(),
        changePageSize: vi.fn()
    };

    beforeEach(() => {
        loading.set(false);
        error.set(null);
        catalogsError.set(null);
        items.set([]);
        totalRegistros.set(0);
        pagina.set(1);
        tamanoPagina.set(20);
        query.set({ fechaInicio: null, fechaFin: null, idMetodoPago: null, idTipoComprobante: null, tipoItem: null, texto: null, pagina: 1, tamanoPagina: 20 });
        cancellationMock.cancel.mockClear();
        apiMock.exportExcel.mockClear(); apiMock.exportPdf.mockClear();
        fileDownloadMock.download.mockClear();
        feedbackMock.success.mockClear(); feedbackMock.error.mockClear();

        Object.values(storeMock).forEach(value => {
            if (typeof value === 'function' && 'mockClear' in value) {
                (value as any).mockClear();
            }
        });

        TestBed.configureTestingModule({
            imports: [VentaListPage],
            providers: [
                { provide: AuthStore, useValue: authStoreMock },
                { provide: VentaApiService, useValue: apiMock },
                { provide: FileDownloadService, useValue: fileDownloadMock },
                { provide: FeedbackService, useValue: feedbackMock },
                provideRouter([])
            ]
        });

        TestBed.overrideComponent(VentaListPage, {
            set: {
                providers: [
                    { provide: VentaListStore, useValue: storeMock },
                    { provide: VentaCancellationService, useValue: cancellationMock }
                ]
            }
        });
    });

    it('should initialize catalogs and sales', () => {
        const fixture = TestBed.createComponent(VentaListPage);

        fixture.detectChanges();

        expect(storeMock.loadCatalogs).toHaveBeenCalledOnce();
        expect(storeMock.load).toHaveBeenCalledOnce();
        expect(fixture.nativeElement.textContent).toContain('Ventas');
    });

    it('should search with current filters', () => {
        const fixture = TestBed.createComponent(VentaListPage);
        const component = fixture.componentInstance;

        fixture.detectChanges();

        component.filterForm.patchValue({
            texto: 'V2026',
            tipoItem: 'SERVICIO'
        });

        component['search']();

        expect(storeMock.search).toHaveBeenCalledWith(
            expect.objectContaining({
                texto: 'V2026',
                tipoItem: 'SERVICIO'
            })
        );
    });

    it('should export the applied filters to Excel and PDF', () => {
        totalRegistros.set(3);
        query.set({ fechaInicio: '2026-08-01', fechaFin: '2026-08-31', idMetodoPago: 1, idTipoComprobante: null, tipoItem: 'SERVICIO', texto: 'misa', pagina: 2, tamanoPagina: 20 });
        const fixture = TestBed.createComponent(VentaListPage);
        fixture.detectChanges();

        fixture.componentInstance['exportExcel']();
        expect(apiMock.exportExcel).toHaveBeenCalledWith(query());
        expect(fileDownloadMock.download).toHaveBeenCalledWith(expect.any(Blob), expect.stringMatching(/^Ventas_\d{8}_\d{6}\.xlsx$/));

        fixture.componentInstance['exportPdf']();
        expect(apiMock.exportPdf).toHaveBeenCalledWith(query());
        expect(fileDownloadMock.download).toHaveBeenCalledWith(expect.any(Blob), expect.stringMatching(/^Ventas_\d{8}_\d{6}\.pdf$/));
        expect(feedbackMock.success).toHaveBeenCalledTimes(2);
    });

    it('should describe mixed content', () => {
        const fixture = TestBed.createComponent(VentaListPage);

        expect(
            fixture.componentInstance['contentLabel'](true, true)
        ).toBe('Productos + servicios');
    });

    it('should cancel an emitted sale and reload the list', () => {
        const fixture = TestBed.createComponent(VentaListPage);

        fixture.detectChanges();
        storeMock.reload.mockClear();

        const venta = {
            idVenta: 1,
            codVenta: 'V2026-00001',
            rowVersion: 'AAAAAAAABQ=',
            puedeAnular: true
        } as any;

        fixture.componentInstance['cancelSale'](venta);

        expect(cancellationMock.cancel).toHaveBeenCalledWith(venta);
        expect(storeMock.reload).toHaveBeenCalledOnce();
    });
});
