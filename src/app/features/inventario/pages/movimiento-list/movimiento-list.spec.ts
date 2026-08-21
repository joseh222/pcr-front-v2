import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ProductoApiService } from '../../../productos/data-access/producto-api.service';
import { InventarioApiService } from '../../data-access/inventario-api.service';
import { InventarioMovementListStore } from '../../data-access/models/inventario-movement-list.store';
import { MovimientoListPage } from './movimiento-list';

describe('MovimientoListPage', () => {
    const storeMock = { loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), items: signal<any[]>([]).asReadonly(), pageNumber: signal(1).asReadonly(), pageSize: signal(20).asReadonly(), totalRecords: signal(0).asReadonly(), isEmpty: () => true, search: vi.fn(), reload: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn() };
    const inventoryApiMock = { getTiposMovimientoHistorial: vi.fn(() => of([])) };
    const productApiMock = { getList: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 100, totalRecords: 0, totalPages: 0 })) };
    const feedbackMock = { warning: vi.fn() };
    beforeEach(() => { Object.values(storeMock).forEach(v => { if (typeof v === 'function' && 'mockClear' in v) (v as any).mockClear(); }); TestBed.configureTestingModule({ imports: [MovimientoListPage], providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } },
        { provide: InventarioApiService, useValue: inventoryApiMock }, { provide: ProductoApiService, useValue: productApiMock }, { provide: FeedbackService, useValue: feedbackMock }
    ] }); TestBed.overrideComponent(MovimientoListPage, { set: { providers: [{ provide: InventarioMovementListStore, useValue: storeMock }] } }); });
    it('should load inventory history', () => { const fixture = TestBed.createComponent(MovimientoListPage); fixture.detectChanges(); expect(storeMock.search).toHaveBeenCalled(); expect(fixture.nativeElement.textContent).toContain('Movimientos'); });
});
