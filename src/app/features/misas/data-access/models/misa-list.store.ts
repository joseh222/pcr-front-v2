import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, map, of, switchMap, tap } from 'rxjs';
import { MisaApiService } from '../misa-api.service';
import { MisaListFilters, MisaListQuery, MisaPagedResponse } from './misa-read.models';

const DEFAULT_PAGE_SIZE = 20;

const DEFAULT_FILTERS: MisaListFilters = {
    fechaInicio: null,
    fechaFin: null,
    idModalidad: null,
    idTipo: null,
    idEstado: null,
    estadoPago: null,
    texto: null
};

const INITIAL_QUERY: MisaListQuery = {
    ...DEFAULT_FILTERS,
    pagina: 1,
    tamanoPagina: DEFAULT_PAGE_SIZE
};

const INITIAL_RESPONSE: MisaPagedResponse = {
    pagina: 1,
    tamanoPagina: DEFAULT_PAGE_SIZE,
    totalRegistros: 0,
    totalPaginas: 0,
    items: []
};

@Injectable()
export class MisaListStore {
    private readonly api = inject(MisaApiService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly querySignal = signal<MisaListQuery>(
        INITIAL_QUERY
    );

    private readonly responseSignal = signal<MisaPagedResponse>(
        INITIAL_RESPONSE
    );

    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);

    private readonly loadRequests =
        new Subject<MisaListQuery>();

    readonly query = this.querySignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();

    readonly items = computed(
        () => this.responseSignal().items
    );

    readonly pagina = computed(
        () => this.querySignal().pagina
    );

    readonly tamanoPagina = computed(
        () => this.querySignal().tamanoPagina
    );

    readonly totalRegistros = computed(
        () => this.responseSignal().totalRegistros
    );

    readonly totalPaginas = computed(
        () => this.responseSignal().totalPaginas
    );

    readonly isEmpty = computed(
        () =>
            !this.loading() &&
            !this.error() &&
            this.items().length === 0
    );

    constructor() {
        this.loadRequests
            .pipe(
                tap(() => {
                    this.loadingSignal.set(true);
                    this.errorSignal.set(null);
                }),
                switchMap(query =>
                    this.api.getList(query).pipe(
                        map(response => ({
                            response,
                            error: null
                        })),
                        catchError(error =>
                            of({
                                response: null,
                                error: this.getErrorMessage(error)
                            })
                        )
                    )
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(result => {
                this.loadingSignal.set(false);

                if (result.response) {
                    this.responseSignal.set(result.response);
                    return;
                }

                this.errorSignal.set(result.error);
            });
    }

    load(): void {
        this.requestLoad();
    }

    reload(): void {
        this.requestLoad();
    }

    search(filters: MisaListFilters): void {
        this.querySignal.update(query => ({
            ...this.normalizeFilters(filters),
            pagina: 1,
            tamanoPagina: query.tamanoPagina
        }));

        this.requestLoad();
    }

    changePage(pagina: number): void {
        if (
            !Number.isInteger(pagina) ||
            pagina < 1 ||
            pagina === this.querySignal().pagina
        ) {
            return;
        }

        this.querySignal.update(query => ({
            ...query,
            pagina
        }));

        this.requestLoad();
    }

    changePageSize(tamanoPagina: number): void {
        if (
            !Number.isInteger(tamanoPagina) ||
            tamanoPagina < 1 ||
            tamanoPagina > 100 ||
            tamanoPagina === this.querySignal().tamanoPagina
        ) {
            return;
        }

        this.querySignal.update(query => ({
            ...query,
            pagina: 1,
            tamanoPagina
        }));

        this.requestLoad();
    }

    resetFilters(): void {
        this.querySignal.update(query => ({
            ...DEFAULT_FILTERS,
            pagina: 1,
            tamanoPagina: query.tamanoPagina
        }));

        this.requestLoad();
    }

    private requestLoad(): void {
        this.loadRequests.next(this.querySignal());
    }

    private normalizeFilters(
        filters: MisaListFilters
    ): MisaListFilters {
        return {
            fechaInicio: filters.fechaInicio ?? null,
            fechaFin: filters.fechaFin ?? null,
            idModalidad: filters.idModalidad ?? null,
            idTipo: filters.idTipo ?? null,
            idEstado: filters.idEstado ?? null,
            estadoPago:
                filters.estadoPago?.trim() || null,
            texto:
                filters.texto?.trim() || null
        };
    }

    private getErrorMessage(error: unknown): string {
        if (error instanceof HttpErrorResponse) {
            const detail = error.error?.detail;
            const message = error.error?.message;

            if (
                typeof detail === 'string' &&
                detail.trim()
            ) {
                return detail.trim();
            }

            if (
                typeof message === 'string' &&
                message.trim()
            ) {
                return message.trim();
            }
        }

        return 'No se pudo cargar la lista de misas.';
    }
}