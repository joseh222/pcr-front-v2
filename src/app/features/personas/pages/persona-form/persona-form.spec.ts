import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { PersonaFormStore } from '../../data-access/models/persona-form.store';
import { PersonaFormPage } from './persona-form';

describe('PersonaFormPage', () => {
    const detail = signal<any>(null);
    const saveResult = signal<any>(null);
    const saveError = signal<string | null>(null);
    const storeMock = {
        tiposDocumento: signal<any[]>([
            { idTipoDocumento: 1, codigo: 'DNI', nombre: 'DNI', longitudMinima: 8, longitudMaxima: 8, soloNumeros: true, isActive: true }
        ]).asReadonly(),
        roles: signal<any[]>([
            { idRolPersona: 7, codigo: 'AGENTE_PASTORAL', nombre: 'Agente pastoral', descripcion: null, isActive: true }
        ]).asReadonly(),
        detail: detail.asReadonly(), loading: signal(false).asReadonly(), loadError: signal<string | null>(null).asReadonly(),
        saving: signal(false).asReadonly(), saveError: saveError.asReadonly(), saveResult: saveResult.asReadonly(),
        initialize: vi.fn(), create: vi.fn(), update: vi.fn(), clearSaveResult: vi.fn(), clearSaveError: vi.fn()
    };
    const feedbackMock = { success: vi.fn(), error: vi.fn(), warning: vi.fn() };

    beforeEach(() => {
        detail.set(null); saveResult.set(null); saveError.set(null);
        Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        feedbackMock.success.mockClear(); feedbackMock.error.mockClear(); feedbackMock.warning.mockClear();
        TestBed.configureTestingModule({
            imports: [PersonaFormPage],
            providers: [
                provideRouter([]),
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } },
                { provide: FeedbackService, useValue: feedbackMock }
            ]
        });
        TestBed.overrideComponent(PersonaFormPage, { set: { providers: [{ provide: PersonaFormStore, useValue: storeMock }] } });
    });

    it('should initialize create mode and block an empty person', () => {
        const fixture = TestBed.createComponent(PersonaFormPage);
        fixture.detectChanges();
        expect(storeMock.initialize).toHaveBeenCalledWith(null);
        expect(fixture.nativeElement.textContent).toContain('Nueva persona');
        fixture.componentInstance['save']();
        expect(storeMock.create).not.toHaveBeenCalled();
    });

    it('should create a person with name and roles', () => {
        const fixture = TestBed.createComponent(PersonaFormPage);
        fixture.detectChanges();
        fixture.componentInstance.form.patchValue({ nombreCompleto: 'JUAN PEREZ', roles: [7] });
        fixture.componentInstance['save']();
        expect(storeMock.create).toHaveBeenCalledWith(expect.objectContaining({
            nombreCompleto: 'JUAN PEREZ', roles: [7]
        }));
    });
});
