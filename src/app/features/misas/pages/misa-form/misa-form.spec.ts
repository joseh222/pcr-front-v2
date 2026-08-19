import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { MisaFormStore } from '../../data-access/models/misa-form.store';
import { MisaFormPage } from './misa-form';
import { By } from '@angular/platform-browser';

describe('MisaFormPage', () => {
    const modalidades = signal([{ idModalidad: 1, nombre: 'Personal' }]);
    const tipos = signal([{ idTipo: 2, codigo: 'DIFUNTO', nombre: 'Difunto' }]);
    const detail = signal<any>(null);
    const loading = signal(false);
    const error = signal<string | null>(null);

    const tiposDocumento = signal([{ idTipoDocumento: 1, codigo: 'DNI', nombre: 'DNI', longitudMinima: 8, longitudMaxima: 8, soloNumeros: true, isActive: true }]);
    const documentPerson = signal<any>(null);
    const documentLookupLoading = signal(false);
    const documentLookupState = signal<'idle' | 'found' | 'not-found' | 'error'>('idle');
    const documentLookupError = signal<string | null>(null);

    const storeMock = {
        modalidades: modalidades.asReadonly(),
        tipos: tipos.asReadonly(),
        detail: detail.asReadonly(),
        loading: loading.asReadonly(),
        error: error.asReadonly(),
        initialize: vi.fn(),

        tiposDocumento: tiposDocumento.asReadonly(),
        documentPerson: documentPerson.asReadonly(),
        documentLookupLoading: documentLookupLoading.asReadonly(),
        documentLookupState: documentLookupState.asReadonly(),
        documentLookupError: documentLookupError.asReadonly(),
        findPersonByDocument: vi.fn(),
        clearDocumentPerson: vi.fn(),

    };

    beforeEach(() => {
        detail.set(null);
        loading.set(false);
        error.set(null);
        storeMock.initialize.mockClear();
        documentPerson.set(null);
        documentLookupLoading.set(false);
        documentLookupState.set('idle');
        documentLookupError.set(null);
        storeMock.findPersonByDocument.mockClear();
        storeMock.clearDocumentPerson.mockClear();
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
            hora: '18:00:00',
            solicitante: { idPersona: 10, idSolicitante: 20, idTipoDocumento: 1, codigoTipoDocumento: 'DNI', nombreTipoDocumento: 'DNI', numeroDocumento: '12345678', nombre: 'JOSE HUAMAN', telefono: '999999999' },
            observaciones: 'OBSERVACION DE PRUEBA',
        });

        const fixture = await createFixture({ id: '25' });
        const component = fixture.componentInstance;

        expect(storeMock.initialize).toHaveBeenCalledWith(25);
        expect(component.form.getRawValue()).toEqual({
            idModalidad: 1, idTipo: 2, fecha: '2026-08-30', hora: '18:00',
            idPersona: 10, idTipoDocumento: 1, numeroDocumento: '12345678',
            nombre: 'JOSE HUAMAN', telefono: '999999999', observaciones: 'OBSERVACION DE PRUEBA'
        });
        expect(fixture.nativeElement.textContent).toContain('Editar misa');
    });

    it('should request a person by document', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        component.form.patchValue({ idTipoDocumento: 1, numeroDocumento: '12345678' });
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('[data-testid="search-person-document"]') as HTMLButtonElement;

        expect(button).toBeTruthy();
        expect(button.disabled).toBe(false);

        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(storeMock.findPersonByDocument).toHaveBeenCalledWith(1, '12345678');
    });

    it('should request a person by document', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        component.form.patchValue({ idTipoDocumento: 1, numeroDocumento: '12345678' });
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('[data-testid="search-person-document"]'));
        button.triggerEventHandler('click');

        expect(storeMock.findPersonByDocument).toHaveBeenCalledWith(1, '12345678');
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