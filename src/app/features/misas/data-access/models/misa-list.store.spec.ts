import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
    Subject,
    of,
    throwError
} from 'rxjs';

import { MisaApiService } from '../misa-api.service';
import { MisaListStore } from './misa-list.store';
import {
    MisaListItem,
    MisaPagedResponse
} from './misa-read.models';

describe('MisaListStore', () => {
    let store: MisaListStore;

    const getListMock = vi.fn();

    const apiMock = {
        getList: getListMock
    };

    beforeEach(() => {
        getListMock.mockReset();

        TestBed.configureTestingModule({
            providers: [
                MisaListStore,
                {
                    provide: MisaApiService,
                    useValue: apiMock
                }
            ]
        });

        store = TestBed.inject(MisaListStore);
    });

    it('should expose the initial list state', () => {
        expect(store.items()).toEqual([]);
        expect(store.loading()).toBe(false);
        expect(store.error()).toBeNull();

        expect(store.pagina()).toBe(1);
        expect(store.tamanoPagina()).toBe(20);

        expect(store.totalRegistros()).toBe(0);
        expect(store.totalPaginas()).toBe(0);
        expect(store.isEmpty()).toBe(true);
    });

    it('should load the misa list', () => {
        getListMock.mockReturnValue(
            of(response([misa(1)], 1, 20, 1))
        );

        store.load();

        expect(getListMock).toHaveBeenCalledWith({
            fechaInicio: null,
            fechaFin: null,
            idModalidad: null,
            idTipo: null,
            idEstado: null,
            estadoPago: null,
            texto: null,
            pagina: 1,
            tamanoPagina: 20
        });

        expect(store.items()).toHaveLength(1);
        expect(store.totalRegistros()).toBe(1);
        expect(store.loading()).toBe(false);
        expect(store.error()).toBeNull();
    });

    it('should reset the page when searching', () => {
        getListMock.mockReturnValue(
            of(response([], 1, 20, 0))
        );

        store.changePage(3);

        store.search({
            fechaInicio: '2026-08-01',
            fechaFin: '2026-08-31',
            idModalidad: 1,
            idTipo: 2,
            idEstado: null,
            estadoPago: ' PENDIENTE ',
            texto: ' JUAN '
        });

        expect(store.pagina()).toBe(1);

        expect(getListMock).toHaveBeenLastCalledWith({
            fechaInicio: '2026-08-01',
            fechaFin: '2026-08-31',
            idModalidad: 1,
            idTipo: 2,
            idEstado: null,
            estadoPago: 'PENDIENTE',
            texto: 'JUAN',
            pagina: 1,
            tamanoPagina: 20
        });
    });

    it('should change the page and load again', () => {
        getListMock.mockReturnValue(
            of(response([], 2, 20, 30))
        );

        store.changePage(2);

        expect(store.pagina()).toBe(2);

        expect(getListMock).toHaveBeenCalledWith(
            expect.objectContaining({
                pagina: 2,
                tamanoPagina: 20
            })
        );
    });

    it('should change the page size and return to page one', () => {
        getListMock.mockReturnValue(
            of(response([], 1, 50, 0))
        );

        store.changePageSize(50);

        expect(store.pagina()).toBe(1);
        expect(store.tamanoPagina()).toBe(50);

        expect(getListMock).toHaveBeenCalledWith(
            expect.objectContaining({
                pagina: 1,
                tamanoPagina: 50
            })
        );
    });

    it('should reset filters while preserving page size', () => {
        getListMock.mockReturnValue(
            of(response([], 1, 50, 0))
        );

        store.changePageSize(50);

        store.search({
            fechaInicio: '2026-08-01',
            fechaFin: null,
            idModalidad: 2,
            idTipo: 3,
            idEstado: 1,
            estadoPago: 'PENDIENTE',
            texto: 'JOSE'
        });

        store.resetFilters();

        expect(store.query()).toEqual({
            fechaInicio: null,
            fechaFin: null,
            idModalidad: null,
            idTipo: null,
            idEstado: null,
            estadoPago: null,
            texto: null,
            pagina: 1,
            tamanoPagina: 50
        });
    });

    it('should expose an API error', () => {
        getListMock.mockReturnValue(
            throwError(() =>
                new HttpErrorResponse({
                    status: 500,
                    error: {
                        detail: 'Error consultando misas.'
                    }
                })
            )
        );

        store.load();

        expect(store.loading()).toBe(false);
        expect(store.error()).toBe(
            'Error consultando misas.'
        );
    });

    it('should only keep the latest list request', () => {
        const firstRequest =
            new Subject<MisaPagedResponse>();

        getListMock
            .mockReturnValueOnce(firstRequest.asObservable())
            .mockReturnValueOnce(
                of(response([misa(2)], 1, 20, 1))
            );

        store.load();

        expect(store.loading()).toBe(true);

        store.search({
            fechaInicio: null,
            fechaFin: null,
            idModalidad: null,
            idTipo: null,
            idEstado: null,
            estadoPago: null,
            texto: 'NUEVA BUSQUEDA'
        });

        expect(store.items()[0].idMisa).toBe(2);

        firstRequest.next(
            response([misa(1)], 1, 20, 1)
        );

        expect(store.items()[0].idMisa).toBe(2);
    });

    function response(
        items: readonly MisaListItem[],
        pagina: number,
        tamanoPagina: number,
        totalRegistros: number
    ): MisaPagedResponse {
        return {
            pagina,
            tamanoPagina,
            totalRegistros,
            totalPaginas:
                totalRegistros === 0
                    ? 0
                    : Math.ceil(
                        totalRegistros / tamanoPagina
                    ),
            items
        };
    }

    function misa(idMisa: number): MisaListItem {
        return {
            idMisa,
            codMisa: `M2026-${idMisa}`,
            fecha: '2026-08-30',
            hora: '18:00:00',
            fechaHora: '2026-08-30T18:00:00',
            observaciones: null,

            modalidad: null,
            tipo: null,
            solicitante: null,
            estado: null,
            solicitudServicio: null,

            cantidadIntenciones: 1,

            puedeEditar: true,
            puedeEliminar: true,
            puedeCobrar: false
        };
    }
});