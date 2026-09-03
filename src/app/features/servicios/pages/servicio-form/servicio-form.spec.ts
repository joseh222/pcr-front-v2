import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ServicioFormStore } from '../../data-access/models/servicio-form.store';
import { ServicioFormPage } from './servicio-form';

describe('ServicioFormPage', () => {
    const detail = signal<any>(null);
    const saveError = signal<string | null>(null);
    const saveResult = signal<any>(null);
    const storeMock = {
        categorias: signal<any[]>([{ idCategoriaServicio: 1, nombre: 'Litúrgicos' }]).asReadonly(), tiposSacramento: signal<any[]>([{ idTipoSacramento: 1, codigo: 'BAUTISMO', nombre: 'Bautismo' }]).asReadonly(), detail: detail.asReadonly(),
        loading: signal(false).asReadonly(), loadError: signal<string | null>(null).asReadonly(), saving: signal(false).asReadonly(), saveError: saveError.asReadonly(), saveResult: saveResult.asReadonly(),
        initialize: vi.fn(), create: vi.fn(), update: vi.fn(), clearSaveError: vi.fn(), clearSaveResult: vi.fn()
    };
    const feedbackMock = { success: vi.fn(), error: vi.fn(), warning: vi.fn() };

    async function createFixture(params: Record<string, string> = {}) {
        TestBed.configureTestingModule({
            imports: [ServicioFormPage],
            providers: [
                provideRouter([{ path: 'catalogos/servicios', component: ServicioFormPage }]),
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(params) } } },
                { provide: FeedbackService, useValue: feedbackMock }
            ]
        });
        TestBed.overrideComponent(ServicioFormPage, { set: { providers: [{ provide: ServicioFormStore, useValue: storeMock }] } });
        await TestBed.compileComponents();
        const fixture = TestBed.createComponent(ServicioFormPage); fixture.detectChanges(); return fixture;
    }

    beforeEach(() => {
        detail.set(null); saveError.set(null); saveResult.set(null);
        Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        feedbackMock.success.mockClear(); feedbackMock.error.mockClear(); feedbackMock.warning.mockClear();
    });

    it('should initialize create mode', async () => {
        const fixture = await createFixture();
        expect(storeMock.initialize).toHaveBeenCalledWith(null);
        expect(fixture.nativeElement.textContent).toContain('Nuevo servicio');
    });

    it('should initialize edit mode and patch detail', async () => {
        detail.set({ idServicio: 5, codigo: 'CONSTANCIA', idCategoriaServicio: 1, nombre: 'Constancia', descripcion: 'Documento', modoPrecio: 'FIJO', precioBase: 15, idTipoSacramentoRequerido: null, rowVersion: 'A' });
        const fixture = await createFixture({ id: '5' });
        expect(storeMock.initialize).toHaveBeenCalledWith(5);
        expect(fixture.componentInstance.form.controls.nombre.value).toBe('Constancia');
        expect(fixture.nativeElement.textContent).toContain('Editar servicio');
    });

    it('should normalize service code', async () => {
        const fixture = await createFixture();
        fixture.componentInstance.form.controls.codigo.setValue(' constancia bautismo ');
        fixture.componentInstance['normalizeCode']();
        expect(fixture.componentInstance.form.controls.codigo.value).toBe('CONSTANCIA_BAUTISMO');
    });

    it('should require base price for fixed service and disable it for variable service', async () => {
        const fixture = await createFixture();
        expect(fixture.componentInstance.form.controls.precioBase.hasError('required')).toBe(true);
        fixture.componentInstance.form.controls.modoPrecio.setValue('VARIABLE');
        expect(fixture.componentInstance.form.controls.precioBase.disabled).toBe(true);
        expect(fixture.componentInstance.form.controls.precioBase.value).toBeNull();
    });

    it('should build a create request and save', async () => {
        const fixture = await createFixture();
        fixture.componentInstance.form.setValue({ codigo: 'CONSTANCIA', idCategoriaServicio: 1, nombre: ' Constancia ', descripcion: ' Documento ', modoPrecio: 'FIJO', precioBase: 15, idTipoSacramentoRequerido: 1 });
        fixture.componentInstance['save']();
        expect(storeMock.create).toHaveBeenCalledWith({ codigo: 'CONSTANCIA', idCategoriaServicio: 1, nombre: 'Constancia', descripcion: 'Documento', modoPrecio: 'FIJO', precioBase: 15, idTipoSacramentoRequerido: 1 });
    });
});
