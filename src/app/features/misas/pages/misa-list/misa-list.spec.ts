import { computed, signal } from '@angular/core';
import { AuthStore } from '../../../auth/data-access/auth.store';
import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import { MisaListStore } from '../../data-access/models/misa-list.store';
import { MisaListItem } from '../../data-access/models/misa-read.models';
import { MisaListPage } from './misa-list';
import { provideRouter } from '@angular/router';

const authStoreMock = { hasPermission: vi.fn(() => true) };

describe('MisaListPage', () => {
    let fixture: ComponentFixture<MisaListPage>;
    let component: MisaListPage;

    const items = signal<readonly MisaListItem[]>([]);
    const loading = signal(false);
    const error = signal<string | null>(null);

    const pagina = signal(1);
    const tamanoPagina = signal(20);
    const totalRegistros = signal(0);

    const modalidades = signal([
        {
            idModalidad: 1,
            nombre: 'Personal'
        }
    ]);

    const tipos = signal([
        {
            idTipo: 2,
            codigo: 'DIFUNTO',
            nombre: 'Difunto'
        }
    ]);

    const estados = signal([
        {
            idEstado: 3,
            categoria: 'MISA',
            nombre: 'REGISTRADO'
        }
    ]);

    const catalogsLoading = signal(false);
    const catalogsError = signal<string | null>(null);

    const storeMock = {
        items: items.asReadonly(),
        loading: loading.asReadonly(),
        error: error.asReadonly(),

        pagina: pagina.asReadonly(),
        tamanoPagina: tamanoPagina.asReadonly(),
        totalRegistros: totalRegistros.asReadonly(),

        modalidades: modalidades.asReadonly(),
        tipos: tipos.asReadonly(),
        estados: estados.asReadonly(),

        catalogsLoading:
            catalogsLoading.asReadonly(),

        catalogsError:
            catalogsError.asReadonly(),

        isEmpty: computed(
            () =>
                !loading() &&
                !error() &&
                items().length === 0
        ),

        loadCatalogs: vi.fn(),
        load: vi.fn(),
        reload: vi.fn(),
        search: vi.fn(),
        changePage: vi.fn(),
        changePageSize: vi.fn(),
        resetFilters: vi.fn()
    };

    beforeEach(async () => {
        vi.clearAllMocks();

        items.set([]);
        loading.set(false);
        error.set(null);

        pagina.set(1);
        tamanoPagina.set(20);
        totalRegistros.set(0);

        catalogsLoading.set(false);
        catalogsError.set(null);

        TestBed.configureTestingModule({
            imports: [MisaListPage],
            providers: [{ provide: AuthStore, useValue: authStoreMock }, 
                provideRouter([])
            ]
        });

        TestBed.overrideComponent(
            MisaListPage,
            {
                set: {
                    providers: [
                        {
                            provide: MisaListStore,
                            useValue: storeMock
                        }
                    ]
                }
            }
        );

        await TestBed.compileComponents();

        fixture =
            TestBed.createComponent(MisaListPage);

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should load catalogs and misas on initialization', () => {
        expect(
            storeMock.loadCatalogs
        ).toHaveBeenCalledOnce();

        expect(
            storeMock.load
        ).toHaveBeenCalledOnce();
    });

    it('should render the page title', () => {
        expect(
            fixture.nativeElement.textContent
        ).toContain('Misas');

        expect(
            fixture.nativeElement.querySelector(
                '[data-testid="misa-list-page"]'
            )
        ).toBeTruthy();
    });

    it('should search using the form filters', () => {
        component.filterForm.patchValue({
            texto: 'JUAN',
            fechaInicio: '2026-08-01',
            fechaFin: '2026-08-31',
            idModalidad: 1,
            idTipo: 2,
            idEstado: 3,
            estadoPago: 'PENDIENTE'
        });

        const form =
            fixture.nativeElement.querySelector(
                '[data-testid="misa-filters"]'
            ) as HTMLFormElement;

        form.dispatchEvent(
            new Event('submit')
        );

        fixture.detectChanges();

        expect(
            storeMock.search
        ).toHaveBeenCalledWith({
            texto: 'JUAN',
            fechaInicio: '2026-08-01',
            fechaFin: '2026-08-31',
            idModalidad: 1,
            idTipo: 2,
            idEstado: 3,
            estadoPago: 'PENDIENTE'
        });
    });

    it('should clear filters', () => {
        component.filterForm.patchValue({
            texto: 'JUAN',
            idModalidad: 1
        });

        const button =
            fixture.nativeElement.querySelector(
                '[data-testid="clear-filters"]'
            ) as HTMLButtonElement;

        button.click();

        fixture.detectChanges();

        expect(
            component.filterForm.getRawValue()
        ).toEqual({
            texto: '',
            fechaInicio: null,
            fechaFin: null,
            idModalidad: null,
            idTipo: null,
            idEstado: null,
            estadoPago: null
        });

        expect(
            storeMock.resetFilters
        ).toHaveBeenCalledOnce();
    });

    it('should render misa rows', () => {
        items.set([
            misa()
        ]);

        totalRegistros.set(1);

        fixture.detectChanges();

        const table =
            fixture.nativeElement.querySelector(
                '[data-testid="misa-table"]'
            );

        expect(table).toBeTruthy();

        expect(
            fixture.nativeElement.textContent
        ).toContain('M2026-00001');

        expect(
            fixture.nativeElement.textContent
        ).toContain('JUAN PEREZ');

        expect(
            fixture.nativeElement.textContent
        ).toContain('Pendiente');
    });

    it('should reload the list', () => {
        const button = fixture.nativeElement.querySelector('[data-testid="reload-misas"]') as HTMLButtonElement;
        button.click();
        expect(storeMock.reload).toHaveBeenCalledOnce();
    });

    it('should expose the new misa navigation', () => {
        const button = fixture.nativeElement.querySelector('[data-testid="new-misa"]');
        expect(button).toBeTruthy();
    });

    it('should expose edit for an editable misa', () => {
        items.set([misa()]);
        totalRegistros.set(1);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[data-testid="edit-misa-1"]')).toBeTruthy();
    });

    function misa(): MisaListItem {
        return {
            idMisa: 1,
            codMisa: 'M2026-00001',

            fecha: '2026-08-30',
            hora: '18:00:00',
            fechaHora: '2026-08-30T18:00:00',

            observaciones: null,

            modalidad: {
                idModalidad: 1,
                nombre: 'Personal'
            },

            tipo: {
                idTipo: 2,
                codigo: 'DIFUNTO',
                nombre: 'Difunto'
            },

            solicitante: {
                idSolicitante: 10,
                idPersona: 20,
                idTipoDocumento: 1,
                codigoTipoDocumento: 'DNI',
                nombreTipoDocumento: 'DNI',
                numeroDocumento: '12345678',
                nombre: 'JUAN PEREZ',
                telefono: '999999999'
            },

            estado: {
                idEstado: 3,
                categoria: 'MISA',
                nombre: 'REGISTRADO'
            },

            solicitudServicio: {
                idSolicitudServicio: 50,
                codSolicitudServicio: 'SOL-000050',
                requierePago: true,
                importe: 30,
                motivoNoPago: null,
                estadoSolicitud: 'ACTIVA',
                estadoPago: 'PENDIENTE'
            },

            cantidadIntenciones: 1,

            puedeEditar: true,
            puedeEliminar: true,
            puedeCobrar: true
        };
    }
});
