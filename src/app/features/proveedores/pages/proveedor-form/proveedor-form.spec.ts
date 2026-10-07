import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ProveedorFormStore } from '../../data-access/models/proveedor-form.store';
import { ProveedorFormPage } from './proveedor-form';

describe('ProveedorFormPage', () => {
    const detail = signal<any>(null);
    const storeMock = {
        tiposDocumento: signal<any[]>([{ idTipoDocumento: 3, codigo: 'RUC', nombre: 'RUC', longitudMinima: 11, longitudMaxima: 11, soloNumeros: true, isActive: true }]).asReadonly(),
        detail: detail.asReadonly(), loading: signal(false).asReadonly(), loadError: signal<string | null>(null).asReadonly(), saving: signal(false).asReadonly(),
        saveError: signal<string | null>(null).asReadonly(), saveResult: signal<any>(null).asReadonly(),
        initialize: vi.fn(), create: vi.fn(), update: vi.fn(), clearSaveError: vi.fn(), clearSaveResult: vi.fn()
    };
    const feedbackMock = { success: vi.fn(), error: vi.fn(), warning: vi.fn() };

    async function createFixture(params: Record<string, string> = {}) {
        TestBed.configureTestingModule({
            imports: [ProveedorFormPage],
            providers: [
                provideRouter([{ path: 'catalogos/proveedores', component: ProveedorFormPage }]),
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(params) } } },
                { provide: FeedbackService, useValue: feedbackMock }
            ]
        });
        TestBed.overrideComponent(ProveedorFormPage, { set: { providers: [{ provide: ProveedorFormStore, useValue: storeMock }] } });
        await TestBed.compileComponents();
        const fixture = TestBed.createComponent(ProveedorFormPage); fixture.detectChanges(); return fixture;
    }

    beforeEach(() => {
        detail.set(null);
        Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
    });

    it('should initialize create mode', async () => {
        const fixture = await createFixture();
        expect(storeMock.initialize).toHaveBeenCalledWith(null);
        expect(fixture.nativeElement.textContent).toContain('Nuevo proveedor');
    });

    it('should require document number when document type is selected', async () => {
        const fixture = await createFixture();
        fixture.componentInstance.form.patchValue({ idTipoDocumento: 3, razonSocial: 'Proveedor SAC' });
        expect(fixture.componentInstance.form.controls.numeroDocumento.hasError('required')).toBe(true);
        expect(fixture.componentInstance.form.invalid).toBe(true);
    });

    it('should allow optional email and build create request', async () => {
        const fixture = await createFixture();
        fixture.componentInstance.form.setValue({
            idTipoDocumento: 3, numeroDocumento: '20123456789', razonSocial: ' Proveedor SAC ', nombreComercial: '',
            telefono: '', email: '', direccion: '', observaciones: ''
        });
        fixture.componentInstance['save']();
        expect(storeMock.create).toHaveBeenCalledWith({
            idTipoDocumento: 3, numeroDocumento: '20123456789', razonSocial: 'Proveedor SAC', nombreComercial: null,
            telefono: null, email: null, direccion: null, observaciones: null
        });
    });
});
