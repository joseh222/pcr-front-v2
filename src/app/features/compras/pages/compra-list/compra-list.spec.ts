import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CompraCancellationService } from '../../data-access/compra-cancellation.service';
import { CompraListStore } from '../../data-access/models/compra-list.store';
import { CompraListPage } from './compra-list';
import { AuthStore } from '../../../auth/data-access/auth.store';

const authStoreMock = { hasPermission: vi.fn(() => true) };

describe('CompraListPage', () => {
    const loading = signal(false); const error = signal<string | null>(null); const items = signal<any[]>([]); const totalRows = signal(0);
    const storeMock = {
        loading: loading.asReadonly(), error: error.asReadonly(), catalogsLoading: signal(false).asReadonly(), catalogsError: signal<string | null>(null).asReadonly(),
        estados: signal<any[]>([]).asReadonly(), tiposComprobante: signal<any[]>([]).asReadonly(), proveedorResults: signal<any[]>([]).asReadonly(), proveedorLoading: signal(false).asReadonly(), proveedorError: signal<string | null>(null).asReadonly(),
        items: items.asReadonly(), totalRows: totalRows.asReadonly(), pageNumber: signal(1).asReadonly(), pageSize: signal(20).asReadonly(), isEmpty: () => !loading() && !error() && items().length === 0,
        loadCatalogs: vi.fn(), load: vi.fn(), searchProveedores: vi.fn(), clearProveedorResults: vi.fn(), search: vi.fn(), resetFilters: vi.fn(), reload: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn()
    };
    const cancellationMock = { cancel: vi.fn(() => of({ idCompra: 5 })) };

    beforeEach(() => {
        loading.set(false); error.set(null); items.set([]); totalRows.set(0); cancellationMock.cancel.mockClear(); Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        TestBed.configureTestingModule({ imports: [CompraListPage], providers: [{ provide: AuthStore, useValue: authStoreMock }, provideRouter([]), { provide: CompraCancellationService, useValue: cancellationMock }] });
        TestBed.overrideComponent(CompraListPage, { set: { providers: [{ provide: CompraListStore, useValue: storeMock }] } });
    });

    it('should initialize catalogs and purchases', () => {
        const fixture = TestBed.createComponent(CompraListPage); fixture.detectChanges();
        expect(storeMock.loadCatalogs).toHaveBeenCalledOnce(); expect(storeMock.load).toHaveBeenCalledOnce(); expect(fixture.nativeElement.textContent).toContain('Compras'); expect(fixture.nativeElement.textContent).toContain('Nueva compra');
    });

    it('should send current filters to the store', () => {
        const fixture = TestBed.createComponent(CompraListPage); fixture.detectChanges();
        fixture.componentInstance.filterForm.patchValue({ search: 'CMP2026', idTipoComprobanteCompra: 1, idEstadoCompra: 1, fechaInicio: '2026-08-01', fechaFin: '2026-08-31' }); fixture.componentInstance['search']();
        expect(storeMock.search).toHaveBeenCalledWith({ search: 'CMP2026', idProveedor: null, idTipoComprobanteCompra: 1, idEstadoCompra: 1, fechaInicio: '2026-08-01', fechaFin: '2026-08-31' });
    });

    it('should render detail and cancel actions for a cancellable purchase', () => {
        items.set([{ idCompra: 5, codCompra: 'CMP2026-000005', fechaCompra: '2026-08-25', createdUtc: '2026-08-25T20:00:00Z', razonSocialProveedor: 'Proveedor SAC', tipoDocumentoProveedor: 'RUC', numeroDocumentoProveedor: '20123456789', nombreTipoComprobante: 'Factura', serieComprobante: 'F001', numeroComprobante: '000123', cantidadDetalles: 1, cantidadTotal: 2, codigoEstadoCompra: 'REGISTRADA', nombreEstadoCompra: 'Registrada', total: 11, puedeAnular: true, rowVersion: 'A' }]); totalRows.set(1);
        const fixture = TestBed.createComponent(CompraListPage); fixture.detectChanges();
        const link = fixture.nativeElement.querySelector('a[aria-label="Ver compra CMP2026-000005"]') as HTMLAnchorElement;
        const cancel = fixture.nativeElement.querySelector('button[aria-label="Anular compra CMP2026-000005"]') as HTMLButtonElement;
        expect(link).toBeTruthy(); expect(link.getAttribute('href')).toBe('/compras/5'); expect(cancel).toBeTruthy();
    });

    it('should cancel purchase and reload list', () => {
        const fixture = TestBed.createComponent(CompraListPage); fixture.detectChanges(); storeMock.reload.mockClear();
        const compra = { idCompra: 5, codCompra: 'CMP2026-000005', rowVersion: 'A', puedeAnular: true } as any;
        fixture.componentInstance['cancel'](compra);
        expect(cancellationMock.cancel).toHaveBeenCalledWith(compra); expect(storeMock.reload).toHaveBeenCalledOnce();
    });

    it('should select supplier as exact filter', () => {
        const fixture = TestBed.createComponent(CompraListPage); const proveedor = { idProveedor: 2, codProveedor: 'PRV2026-000002', razonSocial: 'Proveedor SAC' } as any;
        fixture.componentInstance['selectProveedor'](proveedor);
        expect(fixture.componentInstance.filterForm.controls.idProveedor.value).toBe(2); expect(fixture.componentInstance['selectedProveedor']()?.razonSocial).toBe('Proveedor SAC');
    });
});
