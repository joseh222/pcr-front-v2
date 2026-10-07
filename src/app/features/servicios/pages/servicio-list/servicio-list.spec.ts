import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ServicioListStore } from '../../data-access/models/servicio-list.store';
import { ServicioStatusService } from '../../data-access/servicio-status.service';
import { ServicioListPage } from './servicio-list';
import { AuthStore } from '../../../auth/data-access/auth.store';

const authStoreMock = { hasPermission: vi.fn(() => true) };

describe('ServicioListPage', () => {
    const items = signal<any[]>([]);
    const storeMock = {
        categorias: signal<any[]>([]).asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(),
        catalogsLoading: signal(false).asReadonly(), catalogsError: signal<string | null>(null).asReadonly(), items: items.asReadonly(), pageNumber: signal(1).asReadonly(), pageSize: signal(20).asReadonly(),
        totalRecords: signal(0).asReadonly(), isEmpty: () => items().length === 0,
        loadCatalogs: vi.fn(), load: vi.fn(), reload: vi.fn(), search: vi.fn(), resetFilters: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn()
    };
    const statusMock = { change: vi.fn(() => of({ idServicio: 1 })) };

    beforeEach(() => {
        items.set([]);
        Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        statusMock.change.mockClear();
        TestBed.configureTestingModule({ imports: [ServicioListPage], providers: [{ provide: AuthStore, useValue: authStoreMock }, provideRouter([]), { provide: ServicioStatusService, useValue: statusMock }] });
        TestBed.overrideComponent(ServicioListPage, { set: { providers: [{ provide: ServicioListStore, useValue: storeMock }] } });
    });

    it('should initialize categories and services', () => {
        const fixture = TestBed.createComponent(ServicioListPage); fixture.detectChanges();
        expect(storeMock.loadCatalogs).toHaveBeenCalledOnce(); expect(storeMock.load).toHaveBeenCalledOnce();
        expect(fixture.nativeElement.textContent).toContain('Servicios');
    });

    it('should search current filters', () => {
        const fixture = TestBed.createComponent(ServicioListPage); fixture.detectChanges();
        fixture.componentInstance.filterForm.patchValue({ search: 'MISA', modoPrecio: 'FIJO', isActive: null });
        fixture.componentInstance['search']();
        expect(storeMock.search).toHaveBeenCalledWith(expect.objectContaining({ search: 'MISA', modoPrecio: 'FIJO', isActive: null }));
    });

    it('should change status and reload', () => {
        const fixture = TestBed.createComponent(ServicioListPage); fixture.detectChanges(); storeMock.reload.mockClear();
        const servicio = { idServicio: 1, codigo: 'MISA', nombre: 'Misa', isActive: true, rowVersion: 'A' } as any;
        fixture.componentInstance['changeStatus'](servicio);
        expect(statusMock.change).toHaveBeenCalledWith(servicio); expect(storeMock.reload).toHaveBeenCalledOnce();
    });
});
