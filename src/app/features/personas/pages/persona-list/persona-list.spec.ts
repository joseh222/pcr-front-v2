import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PersonaListStore } from '../../data-access/models/persona-list.store';
import { PersonaListPage } from './persona-list';
import { PersonaStatusService } from '../../data-access/persona-status.service';

describe('PersonaListPage', () => {
    const items = signal<any[]>([]);
    const statusMock = { change: vi.fn(() => ({ subscribe: (cb: (value: boolean) => void) => cb(true) })) };
    const storeMock = {
        tiposDocumento: signal<any[]>([]).asReadonly(), roles: signal<any[]>([]).asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(),
        catalogsLoading: signal(false).asReadonly(), catalogsError: signal<string | null>(null).asReadonly(), items: items.asReadonly(),
        pageNumber: signal(1).asReadonly(), pageSize: signal(20).asReadonly(), totalRecords: signal(0).asReadonly(), isEmpty: () => items().length === 0,
        loadCatalogs: vi.fn(), load: vi.fn(), reload: vi.fn(), search: vi.fn(), resetFilters: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn()
    };

    beforeEach(() => {
        items.set([]);
        Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        TestBed.configureTestingModule({ imports: [PersonaListPage], providers: [provideRouter([]), { provide: PersonaStatusService, useValue: statusMock }] });
        TestBed.overrideComponent(PersonaListPage, { set: { providers: [{ provide: PersonaListStore, useValue: storeMock }] } });
    });

    it('should initialize catalogs and persons', () => {
        const fixture = TestBed.createComponent(PersonaListPage); fixture.detectChanges();
        expect(storeMock.loadCatalogs).toHaveBeenCalledOnce(); expect(storeMock.load).toHaveBeenCalledOnce();
        expect(fixture.nativeElement.textContent).toContain('Personas');
        expect(fixture.nativeElement.textContent).toContain('registro central de personas');
        expect(fixture.nativeElement.textContent).toContain('Nueva persona');
    });

    it('should search current filters', () => {
        const fixture = TestBed.createComponent(PersonaListPage); fixture.detectChanges();
        fixture.componentInstance.filterForm.patchValue({ search: 'JOSE', idTipoDocumento: 1, idRolPersona: 7, isActive: null });
        fixture.componentInstance['search']();
        expect(storeMock.search).toHaveBeenCalledWith(expect.objectContaining({ search: 'JOSE', idTipoDocumento: 1, idRolPersona: 7, isActive: null }));
    });
});
