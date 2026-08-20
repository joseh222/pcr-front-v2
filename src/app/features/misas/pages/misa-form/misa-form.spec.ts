import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { MisaFormStore } from '../../data-access/models/misa-form.store';
import { MisaFormPage } from './misa-form';
import { By } from '@angular/platform-browser';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';

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

    const saving = signal(false);
    const saveError = signal<string | null>(null);
    const saveResult = signal<any>(null);

    const feedbackMock = {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn()
    };

    const dialogMock = {
        open: vi.fn(() => ({ afterClosed: () => EMPTY }))
    };
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

        saving: saving.asReadonly(),
        saveError: saveError.asReadonly(),
        saveResult: saveResult.asReadonly(),

        create: vi.fn(),
        update: vi.fn(),
        clearSaveResult: vi.fn(),
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

        saving.set(false);
        saveError.set(null);
        saveResult.set(null);

        storeMock.create.mockClear();
        storeMock.update.mockClear();
        storeMock.clearSaveResult.mockClear();

        feedbackMock.success.mockClear();
        feedbackMock.error.mockClear();
        feedbackMock.warning.mockClear();
        feedbackMock.info.mockClear();
        dialogMock.open.mockClear();
        dialogMock.open.mockReturnValue({ afterClosed: () => EMPTY });
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
            solicitudServicio: {
                idSolicitudServicio: 50,
                codSolicitudServicio: 'SOL-000050',
                requierePago: true,
                importe: 30,
                motivoNoPago: null,
                estadoSolicitud: 'ACTIVA',
                estadoPago: 'PENDIENTE'
            },
            puedeEditar: true,
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
            intenciones: [{ idIntencion: 70, nombre: "CARLOS PEREZ", observacion: "" }],
            requierePago: true,
            motivoNoPago: '',
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

    it('should require a reason when misa does not require payment', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        component.form.controls.requierePago.setValue(false);
        component['onRequiresPaymentChange']();

        expect(component.form.controls.motivoNoPago.hasError('required')).toBe(true);

        component.form.controls.motivoNoPago.setValue('AUTORIZADO POR EL PARROCO');

        expect(component.form.controls.motivoNoPago.valid).toBe(true);
    });

    it('should build a create request without intention ids', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        component.form.patchValue({
            idModalidad: 1,
            idTipo: 2,
            fecha: '2026-08-30',
            hora: '18:00',
            nombre: 'JOSE HUAMAN',
            requierePago: true
        });

        component['onMisaContextChanged']();
        component.form.controls.intenciones.at(0).controls.nombre.setValue('CARLOS PEREZ');

        const request = component['buildCreateRequest']();

        expect(request.intenciones).toEqual([
            {
                nombre: 'CARLOS PEREZ',
                observacion: null
            }
        ]);

        expect(request.hora).toBe('18:00:00');
        expect(request.requierePago).toBe(true);
        expect(request.motivoNoPago).toBeNull();
    });

    it('should show backend save error as feedback', async () => {
        const fixture = await createFixture({});

        saveError.set(
            'La misa de matrimonio debe contener exactamente dos personas.'
        );

        fixture.detectChanges();

        expect(feedbackMock.error).toHaveBeenCalledWith(
            'La misa de matrimonio debe contener exactamente dos personas.'
        );
    });

    it('should ask whether to sell after creating a payable misa', async () => {
        const fixture = await createFixture({});

        saveResult.set({
            idMisa: 25,
            codMisa: 'M2026-00025',
            idSolicitudServicio: 100,
            codSolicitudServicio: 'SS2026-00100',
            requierePago: true,
            importe: 30,
            estadoPago: 'PENDIENTE',
            mensaje: 'Misa registrada correctamente.'
        });
        fixture.detectChanges();

        expect(dialogMock.open).toHaveBeenCalledOnce();
        expect(storeMock.clearSaveResult).toHaveBeenCalledOnce();
    });

    it('should use backend update success message', async () => {
        const fixture = await createFixture({ id: '25' });
        const component = fixture.componentInstance;

        const message = component['getSaveSuccessMessage']({
            idMisa: 25,
            codMisa: 'M2026-00025',
            idSolicitudServicio: 100,
            codSolicitudServicio: 'SOL-000100',
            requierePago: true,
            importe: 30,
            estadoPago: 'PENDIENTE',
            mensaje: 'Misa actualizada correctamente.'
        }, true);

        expect(message).toBe('Misa actualizada correctamente.');
    });

    async function createFixture(params: Record<string, string>) {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [MisaFormPage],
            providers: [
                provideRouter([]),
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(params) } } },
                {
                    provide: FeedbackService,
                    useValue: feedbackMock
                },
                { provide: MatDialog, useValue: dialogMock }
            ]
        });

        TestBed.overrideComponent(MisaFormPage, {
            set: {
                providers: [
                    { provide: MisaFormStore, useValue: storeMock },
                    { provide: FeedbackService, useValue: feedbackMock },
                    { provide: MatDialog, useValue: dialogMock }
                ]
            }
        });

        await TestBed.compileComponents();

        const fixture = TestBed.createComponent(MisaFormPage);
        fixture.detectChanges();
        return fixture;
    }
});