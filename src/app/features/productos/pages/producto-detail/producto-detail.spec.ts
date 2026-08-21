import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { InventarioMovementListStore } from '../../../inventario/data-access/models/inventario-movement-list.store';
import { ProductoDetailStore } from '../../data-access/models/producto-detail.store';
import { ProductoDetailPage } from './producto-detail';

describe('ProductoDetailPage', () => {
    const storeMock = { detail: signal<any>({ idProducto: 5, codProducto: 'P2026-00000005', nombre: 'Vela', sku: 'VEL-001', nombreCategoria: 'Velas', nombreMarca: null, precioCompra: 2, precioVenta: 5, descripcion: null, isActive: true }).asReadonly(), inventory: signal<any>({ idProducto: 5, stockActual: 10, fechaUltimoMovimiento: null, updatedUtc: null }).asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), load: vi.fn() };
    const movementMock = { loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), items: signal<any[]>([]).asReadonly(), pageNumber: signal(1).asReadonly(), pageSize: signal(20).asReadonly(), totalRecords: signal(0).asReadonly(), isEmpty: () => true, search: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn() };
    beforeEach(() => { storeMock.load.mockClear(); movementMock.search.mockClear(); TestBed.configureTestingModule({ imports: [ProductoDetailPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '5' }) } } }] }); TestBed.overrideComponent(ProductoDetailPage, { set: { providers: [{ provide: ProductoDetailStore, useValue: storeMock }, { provide: InventarioMovementListStore, useValue: movementMock }] } }); });
    it('should load product and inventory history', () => { const fixture = TestBed.createComponent(ProductoDetailPage); fixture.detectChanges(); expect(storeMock.load).toHaveBeenCalledWith(5); expect(movementMock.search).toHaveBeenCalledWith({ idProducto: 5, idTipoMovimiento: null, fechaInicio: null, fechaFin: null }); expect(fixture.nativeElement.textContent).toContain('Historial de movimientos'); });
});
