import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { MisaFormStore } from '../../data-access/models/misa-form.store';
import { MisaFormPage } from './misa-form';

describe('MisaFormPage', () => {
    const modalidades = signal([{ idModalidad: 1, nombre: 'Personal' }]);
    const tipos = signal([{ idTipo: 2, codigo: 'DIFUNTO', nombre: 'Difunto' }]);
    const detail = signal<any>(null);
    const loading = signal(false);
    const error = signal<string | null>(null);

    const storeMock = {
        modalidades: modalidades.asReadonly(),
        tipos: tipos.asReadonly(),
        detail: detail.asReadonly(),
        loading: loading.asReadonly(),
        error: error.asReadonly(),
        initialize: vi.fn()
    };

    beforeEach(() => {
        detail.set(null);
        loading.set(false);
        error.set(null);
        storeMock.initialize.mockClear();
    });

    it('should initialize create mode', async () => {
        const fixture = await createFixture({});
        expect(storeMock.initialize).toHaveBeenCalledWith(null);
        expect(fixture.nativeElement.textContent).toContain('Nueva misa');
    });

    it('should initialize edit mode and patch the general fields', async () => {
        detail.set({
            modalidad: { idModalidad: 1, nombre: 'Personal' },
            tipo: { idTipo: 2, codigo: 'DIFUNTO', nombre: 'Difunto' },
            fecha: '2026-08-30T00:00:00',
            hora: '18:00:00'
        });

        const fixture = await createFixture({ id: '25' });
        const component = fixture.componentInstance;

        expect(storeMock.initialize).toHaveBeenCalledWith(25);
        expect(component.form.getRawValue()).toEqual({ idModalidad: 1, idTipo: 2, fecha: '2026-08-30', hora: '18:00' });
        expect(fixture.nativeElement.textContent).toContain('Editar misa');
    });

    async function createFixture(params: Record<string, string>) {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [MisaFormPage],
            providers: [
                provideRouter([]),
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(params) } } }
            ]
        });

        TestBed.overrideComponent(MisaFormPage, {
            set: { providers: [{ provide: MisaFormStore, useValue: storeMock }] }
        });

        await TestBed.compileComponents();

        const fixture = TestBed.createComponent(MisaFormPage);
        fixture.detectChanges();
        return fixture;
    }
});