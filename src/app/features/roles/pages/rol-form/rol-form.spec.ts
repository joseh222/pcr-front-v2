import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { RolFormStore } from '../../data-access/models/rol-form.store';
import { RolFormPage } from './rol-form';

describe('RolFormPage', () => {
    let fixture: ComponentFixture<RolFormPage>;
    const permissions = signal([{ idPermiso: 1, codigo: 'MISA_VER', modulo: 'MISA', accion: 'VER', nombre: 'Ver misas', descripcion: null, orden: 1, isActive: true, isSystem: true }]);
    const store = { loading: signal(false), loadError: signal(null), saving: signal(false), saveError: signal(null), saveResult: signal(null), detail: signal(null), permissions, assignedPermissionIds: signal([]), initialize: vi.fn(), create: vi.fn(), update: vi.fn(), clearSaveError: vi.fn(), clearSaveResult: vi.fn() }; const feedback = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
    beforeEach(async () => { store.initialize.mockClear(); await TestBed.configureTestingModule({ imports: [RolFormPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }, { provide: FeedbackService, useValue: feedback }] }).overrideComponent(RolFormPage, { set: { providers: [{ provide: RolFormStore, useValue: store }] } }).compileComponents(); fixture = TestBed.createComponent(RolFormPage); fixture.detectChanges(); });
    it('should initialize create mode and show permission catalog', () => { expect(store.initialize).toHaveBeenCalledWith(null); expect(fixture.nativeElement.textContent).toContain('Nuevo rol'); expect(fixture.nativeElement.textContent).toContain('Ver misas'); });
});
