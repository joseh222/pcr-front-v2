import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { MisaFormStore } from '../../data-access/models/misa-form.store';
import { MisaFormPage } from './misa-form';
import { By } from '@angular/platform-browser';

describe('MisaFormPage', () => {
    const modalidades = signal([{ idModalidad: 1, nombre: 'Personal' }]);
    const tipos = signal([
        { idTipo: 2, codigo: 'DIFUNTO', nombre: 'Difunto' },
        { idTipo: 4, codigo: 'MATRIMONIO', nombre: 'Aniversario Matrimonial' }
    ]);
    const detail = signal<any>(null);
    const loading = signal(false);
    const error = signal<string | null>(null);

    const tiposDocumento = signal([{ idTipoDocumento: 1, codigo: 'DNI', nombre: 'DNI', longitudMinima: 8, longitudMaxima: 8, soloNumeros: true, isActive: true }]);
    const documentPerson = signal<any>(null);
    const documentLookupLoading = signal(false);
    const documentLookupState = signal<'idle' | 'found' | 'not-found' | 'error'>('idle');
    const documentLookupError = signal<string | null>(null);

    const personSearchResults = signal<any[]>([]);
    const personSearchLoading = signal(false);
    const personSearchError = signal<string | null>(null);
    const santos = signal([
        { idSanto: 1, nombre: 'San Judas Tadeo' }
    ]);
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

        personSearchResults: personSearchResults.asReadonly(),
        personSearchLoading: personSearchLoading.asReadonly(),
        personSearchError: personSearchError.asReadonly(),
        searchPersons: vi.fn(),
        clearPersonSearch: vi.fn(),
        santos: santos.asReadonly(),
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
        personSearchResults.set([]);
        personSearchLoading.set(false);
        personSearchError.set(null);
        storeMock.searchPersons.mockClear();
        storeMock.clearPersonSearch.mockClear();
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
            santo: null,
            motivo: 'POR SU PRONTA RECUPERACION',
            ofrecen: 'FAMILIA HUAMAN',
            celular: '999999999',
            devotos: null,
            intenciones: [
                { idIntencion: 70, nombre: 'CARLOS PEREZ', observacion: null }
            ],
        });

        const fixture = await createFixture({ id: '25' });
        const component = fixture.componentInstance;

        expect(storeMock.initialize).toHaveBeenCalledWith(25);
        expect(component.form.getRawValue()).toEqual({
            idModalidad: 1, idTipo: 2, fecha: '2026-08-30', hora: '18:00',
            idPersona: 10, idTipoDocumento: 1, numeroDocumento: '12345678',
            nombre: 'JOSE HUAMAN', telefono: '999999999', observaciones: 'OBSERVACION DE PRUEBA',
            idSanto: null,
            motivo: 'POR SU PRONTA RECUPERACION',
            ofrecen: 'FAMILIA HUAMAN',
            celular: '999999999',
            devotos: '',
            intenciones: [{ idIntencion: 70, nombre: "CARLOS PEREZ", observacion: "" }]
        });
        expect(component.form.controls.intenciones.length).toBe(1);
        expect(component.form.controls.intenciones.at(0).controls.idIntencion.value).toBe(70);
        expect(component.form.controls.intenciones.at(0).controls.nombre.value).toBe('CARLOS PEREZ');
        expect(fixture.nativeElement.textContent).toContain('Editar misa');
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

    it('should patch an existing person returned by document', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        documentPerson.set({
            idPersona: 15, idTipoDocumento: 1, numeroDocumento: '12345678',
            nombreCompleto: 'MARIA PEREZ', telefono: '987654321'
        });

        fixture.detectChanges();

        expect(component.form.controls.idPersona.value).toBe(15);
        expect(component.form.controls.nombre.value).toBe('MARIA PEREZ');
        expect(component.form.controls.telefono.value).toBe('987654321');
    });

    it('should fill requester data when selecting a person', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        component['selectPerson']({
            idPersona: 25,
            codPersona: 'PER-25',
            idTipoDocumento: 1,
            codigoTipoDocumento: 'DNI',
            numeroDocumento: '87654321',
            nombreCompleto: 'CARLOS PEREZ',
            fechaNacimiento: null,
            telefono: '955555555',
            email: null,
            rolesPersona: null
        });

        expect(component.form.controls.idPersona.value).toBe(25);
        expect(component.form.controls.idTipoDocumento.value).toBe(1);
        expect(component.form.controls.numeroDocumento.value).toBe('87654321');
        expect(component.form.controls.nombre.value).toBe('CARLOS PEREZ');
        expect(component.form.controls.telefono.value).toBe('955555555');
    });

    it('should configure one intention for a personal misa', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        component.form.patchValue({ idModalidad: 1, idTipo: 2 });
        component['onMisaContextChanged']();

        expect(component.form.controls.intenciones.length).toBe(1);
    });

    it('should configure exactly two intentions for marriage', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        component.form.patchValue({ idModalidad: 2, idTipo: 4 });
        component['onMisaContextChanged']();

        expect(component.form.controls.intenciones.length).toBe(2);

        component['addIntention']();

        expect(component.form.controls.intenciones.length).toBe(2);
    });

    it('should allow multiple intentions for a community misa', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        component.form.patchValue({ idModalidad: 2, idTipo: 2 });
        component['onMisaContextChanged']();

        expect(component.form.controls.intenciones.length).toBe(1);

        component['addIntention']();
        component['addIntention']();

        expect(component.form.controls.intenciones.length).toBe(3);
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