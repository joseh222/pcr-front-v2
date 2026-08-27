import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { UsuarioActionsService } from '../../data-access/usuario-actions.service';
import { UsuarioListStore } from '../../data-access/models/usuario-list.store';
import { UsuarioListPage } from './usuario-list';

describe('UsuarioListPage', () => {
    let fixture: ComponentFixture<UsuarioListPage>;
    const store = { loadRoles: vi.fn(), load: vi.fn(), reload: vi.fn(), search: vi.fn(), resetFilters: vi.fn(), changePage: vi.fn(), changePageSize: vi.fn(), roles: signal([]), rolesLoading: signal(false), rolesError: signal(null), items: signal([]), loading: signal(false), error: signal(null), totalRecords: signal(0), pageNumber: signal(1), pageSize: signal(20), isEmpty: signal(true) };
    const actions = { changeStatus: vi.fn(), resetPassword: vi.fn(), revokeSession: vi.fn() };
    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [UsuarioListPage], providers: [provideRouter([]), { provide: AuthStore, useValue: { currentUser: signal({ idUser: 1 }) } }, { provide: UsuarioActionsService, useValue: actions }] }).overrideComponent(UsuarioListPage, { set: { providers: [{ provide: UsuarioListStore, useValue: store }] } }).compileComponents();
        fixture = TestBed.createComponent(UsuarioListPage); fixture.detectChanges();
    });
    it('should load roles and users on init', () => { expect(store.loadRoles).toHaveBeenCalled(); expect(store.load).toHaveBeenCalled(); expect(fixture.nativeElement.textContent).toContain('Usuarios'); });
});
