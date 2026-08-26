import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProveedorListStore } from '../../data-access/models/proveedor-list.store';
import { ProveedorStatusService } from '../../data-access/proveedor-status.service';
import { ProveedorListPage } from './proveedor-list';

describe('ProveedorListPage', () => {
    const items = signal<any[]>([]);
    const storeMock = {
        tiposDocumento: signal<any[]>([]).asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(),
        catalogsLoading: signal(false).asReadonly(), catalogsError: signal<string | null>(null).asReadonly(), items: items.asReadonly(),
        pageNumber: signal(1).asReadonly(), pageSize: signal(20).asReadonly(), totalRecords: signal(0).asReadonly(), isEmpty: () => items().length === 0,
        loadCatalogs: vi.fn(), load: vi.fn(), reload: vi.fn(), search: vi.fn(), resetFilters: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn()
    };
    const statusMock = { change: vi.fn(() => of({ idProveedor: 1 })) };

    beforeEach(() => {
        items.set([]);
        Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        statusMock.change.mockClear();
        TestBed.configureTestingModule({ imports: [ProveedorListPage], providers: [provideRouter([]), { provide: ProveedorStatusService, useValue: statusMock }] });
        TestBed.overrideComponent(ProveedorListPage, { set: { providers: [{ provide: ProveedorListStore, useValue: storeMock }] } });
    });

    it('should initialize catalogs and suppliers', () => {
        const fixture = TestBed.createComponent(ProveedorListPage); fixture.detectChanges();
        expect(storeMock.loadCatalogs).toHaveBeenCalledOnce(); expect(storeMock.load).toHaveBeenCalledOnce();
        expect(fixture.nativeElement.textContent).toContain('Proveedores');
    });

    it('should search current filters', () => {
        const fixture = TestBed.createComponent(ProveedorListPage); fixture.detectChanges();
        fixture.componentInstance.filterForm.patchValue({ search: 'SAN', idTipoDocumento: 3, isActive: null });
        fixture.componentInstance['search']();
        expect(storeMock.search).toHaveBeenCalledWith(expect.objectContaining({ search: 'SAN', idTipoDocumento: 3, isActive: null }));
    });
});
