import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PersonaListStore } from '../../data-access/models/persona-list.store';
import { PersonaStatusService } from '../../data-access/persona-status.service';
import { PersonaListPage } from './persona-list';

describe('PersonaListPage', () => {
    const items = signal<any[]>([]); const granted = new Set<string>();
    const authStoreMock = { hasPermission: vi.fn((permission: string) => granted.has(permission)) };
    const statusMock = { change: vi.fn(() => ({ subscribe: (cb: (value: boolean) => void) => cb(true) })) };
    const storeMock = {
        tiposDocumento: signal<any[]>([]).asReadonly(), roles: signal<any[]>([]).asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), catalogsLoading: signal(false).asReadonly(), catalogsError: signal<string | null>(null).asReadonly(), items: items.asReadonly(), pageNumber: signal(1).asReadonly(), pageSize: signal(20).asReadonly(), totalRecords: signal(0).asReadonly(), isEmpty: () => items().length === 0,
        loadCatalogs: vi.fn(), load: vi.fn(), reload: vi.fn(), search: vi.fn(), resetFilters: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn()
    };

    beforeEach(() => {
        items.set([]); granted.clear(); authStoreMock.hasPermission.mockClear(); statusMock.change.mockClear(); Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        TestBed.configureTestingModule({ imports: [PersonaListPage], providers: [provideRouter([]), { provide: PersonaStatusService, useValue: statusMock }, { provide: AuthStore, useValue: authStoreMock }] });
        TestBed.overrideComponent(PersonaListPage, { set: { providers: [{ provide: PersonaListStore, useValue: storeMock }] } });
    });

    it('should initialize catalogs and persons without write actions when permissions are missing', () => {
        const fixture = TestBed.createComponent(PersonaListPage); fixture.detectChanges();
        expect(storeMock.loadCatalogs).toHaveBeenCalledOnce(); expect(storeMock.load).toHaveBeenCalledOnce(); expect(fixture.nativeElement.textContent).toContain('Personas'); expect(fixture.nativeElement.textContent).not.toContain('Nueva persona');
    });

    it('should show create action when permission is granted', () => {
        granted.add('PERSONA_CREAR'); const fixture = TestBed.createComponent(PersonaListPage); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('Nueva persona');
    });

    it('should search current filters', () => {
        const fixture = TestBed.createComponent(PersonaListPage); fixture.detectChanges(); fixture.componentInstance.filterForm.patchValue({ search: 'JOSE', idTipoDocumento: 1, idRolPersona: 7, isActive: null }); fixture.componentInstance['search'](); expect(storeMock.search).toHaveBeenCalledWith(expect.objectContaining({ search: 'JOSE', idTipoDocumento: 1, idRolPersona: 7, isActive: null }));
    });
});
