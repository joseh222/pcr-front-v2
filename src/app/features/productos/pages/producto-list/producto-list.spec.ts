import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProductoListStore } from '../../data-access/models/producto-list.store';
import { ProductoStatusService } from '../../data-access/producto-status.service';
import { ProductoListPage } from './producto-list';

describe('ProductoListPage', () => {
    const items = signal<any[]>([]);
    const storeMock = {
        categorias: signal<any[]>([]).asReadonly(), marcas: signal<any[]>([]).asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(),
        catalogsLoading: signal(false).asReadonly(), catalogsError: signal<string | null>(null).asReadonly(), items: items.asReadonly(), pageNumber: signal(1).asReadonly(), pageSize: signal(20).asReadonly(),
        totalRecords: signal(0).asReadonly(), isEmpty: () => items().length === 0,
        loadCatalogs: vi.fn(), load: vi.fn(), reload: vi.fn(), search: vi.fn(), resetFilters: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn()
    };
    const statusMock = { change: vi.fn(() => of({ idProducto: 1 })) };

    beforeEach(() => {
        items.set([]); Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); }); statusMock.change.mockClear();
        TestBed.configureTestingModule({ imports: [ProductoListPage], providers: [provideRouter([]), { provide: ProductoStatusService, useValue: statusMock }] });
        TestBed.overrideComponent(ProductoListPage, { set: { providers: [{ provide: ProductoListStore, useValue: storeMock }] } });
    });

    it('should initialize catalogs and products', () => {
        const fixture = TestBed.createComponent(ProductoListPage); fixture.detectChanges();
        expect(storeMock.loadCatalogs).toHaveBeenCalledOnce(); expect(storeMock.load).toHaveBeenCalledOnce(); expect(fixture.nativeElement.textContent).toContain('Productos');
    });

    it('should search current filters', () => {
        const fixture = TestBed.createComponent(ProductoListPage); fixture.detectChanges();
        fixture.componentInstance.filterForm.patchValue({ search: 'VELA', isActive: null }); fixture.componentInstance['search']();
        expect(storeMock.search).toHaveBeenCalledWith(expect.objectContaining({ search: 'VELA', isActive: null }));
    });

    it('should change status and reload', () => {
        const fixture = TestBed.createComponent(ProductoListPage); fixture.detectChanges(); storeMock.reload.mockClear();
        const product = { idProducto: 1, codProducto: 'P1', nombre: 'Vela', isActive: true, rowVersion: 'A' } as any;
        fixture.componentInstance['changeStatus'](product);
        expect(statusMock.change).toHaveBeenCalledWith(product); expect(storeMock.reload).toHaveBeenCalledOnce();
    });
});
