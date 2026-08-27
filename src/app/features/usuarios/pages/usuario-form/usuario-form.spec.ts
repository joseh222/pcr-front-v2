import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PersonaApiService } from '../../../personas/data-access/persona-api.service';
import { UsuarioFormStore } from '../../data-access/models/usuario-form.store';
import { UsuarioFormPage } from './usuario-form';

describe('UsuarioFormPage', () => {
    let fixture: ComponentFixture<UsuarioFormPage>;
    const store = { initialize: vi.fn(), create: vi.fn(), update: vi.fn(), clearSaveResult: vi.fn(), clearSaveError: vi.fn(), roles: signal([]), detail: signal(null), loading: signal(false), loadError: signal(null), saving: signal(false), saveError: signal(null), saveResult: signal(null) };
    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [UsuarioFormPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }, { provide: PersonaApiService, useValue: { search: vi.fn(() => of([])) } }, { provide: AuthStore, useValue: { currentUser: signal({ idUser: 1 }) } }, { provide: FeedbackService, useValue: { success: vi.fn(), error: vi.fn(), warning: vi.fn() } }, { provide: MatDialog, useValue: { open: vi.fn() } }] }).overrideComponent(UsuarioFormPage, { set: { providers: [{ provide: UsuarioFormStore, useValue: store }] } }).compileComponents();
        fixture = TestBed.createComponent(UsuarioFormPage); fixture.detectChanges();
    });
    it('should initialize create mode', () => { expect(store.initialize).toHaveBeenCalledWith(null); expect(fixture.nativeElement.textContent).toContain('Nuevo usuario'); });
});
