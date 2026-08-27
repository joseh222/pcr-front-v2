import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { RolActionsService } from '../../data-access/rol-actions.service';
import { RolListStore } from '../../data-access/models/rol-list.store';
import { RolListPage } from './rol-list';

describe('RolListPage', () => {
    let fixture: ComponentFixture<RolListPage>;
    const store = { load: vi.fn(), reload: vi.fn(), search: vi.fn(), resetFilters: vi.fn(), items: signal([]), loading: signal(false), error: signal(null), totalRecords: signal(0), visibleRecords: signal(0), isEmpty: signal(true) }; const actions = { changeStatus: vi.fn(() => of(false)) };
    beforeEach(async () => { store.load.mockClear(); await TestBed.configureTestingModule({ imports: [RolListPage], providers: [provideRouter([]), { provide: RolActionsService, useValue: actions }] }).overrideComponent(RolListPage, { set: { providers: [{ provide: RolListStore, useValue: store }] } }).compileComponents(); fixture = TestBed.createComponent(RolListPage); fixture.detectChanges(); });
    it('should load roles on init', () => { expect(store.load).toHaveBeenCalled(); expect(fixture.nativeElement.textContent).toContain('Roles y permisos'); });
});
