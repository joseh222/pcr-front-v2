import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { VentaApiService } from '../venta-api.service';
import { VentaMetodoPago, VentaTipoComprobante } from './venta-catalog.models';
import { VentaListFilters, VentaListQuery, VentaPagedResponse } from './venta-read.models';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_FILTERS:
    VentaListFilters = {
    fechaInicio: null,
    fechaFin: null,
    idMetodoPago: null,
    idTipoComprobante: null,
    tipoItem: null,
    texto: null
};

const INITIAL_QUERY: VentaListQuery = {
    ...DEFAULT_FILTERS,
    pagina: 1,
    tamanoPagina: DEFAULT_PAGE_SIZE
};

const INITIAL_RESPONSE: VentaPagedResponse = {
    pagina: 1,
    tamanoPagina: DEFAULT_PAGE_SIZE,
    totalRegistros: 0,
    totalPaginas: 0,
    items: []
};

@Injectable()
export class VentaListStore {
    private readonly api = inject(VentaApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly querySignal = signal<VentaListQuery>(INITIAL_QUERY);
    private readonly responseSignal = signal<VentaPagedResponse>(INITIAL_RESPONSE);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);
    private readonly metodosPagoSignal = signal<readonly VentaMetodoPago[]>([]);
    private readonly tiposComprobanteSignal = signal<readonly VentaTipoComprobante[]>([]);
    private readonly catalogsLoadingSignal = signal(false);
    private readonly catalogsLoadedSignal = signal(false);
    private readonly catalogsErrorSignal = signal<string | null>(null);
    private readonly loadRequests = new Subject<VentaListQuery>();
    readonly query = this.querySignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();
    readonly metodosPago = this.metodosPagoSignal.asReadonly();
    readonly tiposComprobante = this.tiposComprobanteSignal.asReadonly();
    readonly catalogsLoading = this.catalogsLoadingSignal.asReadonly();
    readonly catalogsError = this.catalogsErrorSignal.asReadonly();
    readonly items = computed(() => this.responseSignal().items);
    readonly pagina = computed(() => this.querySignal().pagina);
    readonly tamanoPagina = computed(() => this.querySignal().tamanoPagina);
    readonly totalRegistros = computed(() => this.responseSignal().totalRegistros);
    readonly totalPaginas = computed(() => this.responseSignal().totalPaginas);
    readonly isEmpty = computed(() => !this.loading() && !this.error() && this.items().length === 0);

    constructor() {

        this.loadRequests.pipe(tap(() => {
            this.loadingSignal.set(true);
            this.errorSignal.set(null);
        }), switchMap(query => this.api
            .getList(query)
            .pipe(
                map(response => ({
                    response,
                    error: null
                })),
                catchError(
                    error => of({
                        response: null,
                        error: getApiErrorMessage(error, 'No se pudieron cargar las ventas.')
                    })
                )
            )
        ), takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            this.loadingSignal.set(false);
            if (result.response) {
                this.responseSignal.set(result.response);
                return;
            }
            this.errorSignal.set(result.error);
        });
    }

    loadCatalogs(): void {
        if (this.catalogsLoadedSignal() || this.catalogsLoadingSignal()) {
            return;
        }

        this.catalogsLoadingSignal.set(true);
        this.catalogsErrorSignal.set(null);

        forkJoin({
            metodosPago: this.api.getMetodosPago(),
            tiposComprobante: this.api.getTiposComprobante()
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.metodosPagoSignal.set(result.metodosPago);
                    this.tiposComprobanteSignal.set(result.tiposComprobante);
                    this.catalogsLoadedSignal.set(true);
                    this.catalogsLoadingSignal.set(false);
                },
                error: error => {
                    this.catalogsLoadingSignal.set(false);
                    this.catalogsErrorSignal.set(getApiErrorMessage(error, 'No se pudieron cargar algunos filtros de ventas.'));
                }
            });
    }

    load(): void {
        this.requestLoad();
    }

    reload(): void {
        this.requestLoad();
    }

    search(filters: VentaListFilters): void {
        this.querySignal.update(
            query => ({
                ...this.normalizeFilters(filters),
                pagina: 1,
                tamanoPagina: query.tamanoPagina
            })
        );

        this.requestLoad();
    }

    resetFilters(): void {
        this.querySignal.update(
            query => ({
                ...DEFAULT_FILTERS,
                pagina: 1,
                tamanoPagina: query.tamanoPagina
            })
        );
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

        this.querySignal.update(
            query => ({
                ...query,
                pagina
            })
        );

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

        this.querySignal.update(
            query => ({
                ...query,
                pagina: 1,
                tamanoPagina
            })
        );

        this.requestLoad();
    }

    private requestLoad(): void {
        this.loadRequests.next(this.querySignal());
    }

    private normalizeFilters(filters: VentaListFilters): VentaListFilters {
        return {
            fechaInicio: filters.fechaInicio ?? null,
            fechaFin: filters.fechaFin ?? null,
            idMetodoPago: filters.idMetodoPago ?? null,
            idTipoComprobante: filters.idTipoComprobante ?? null,
            tipoItem: filters.tipoItem ?? null,
            texto: filters.texto?.trim() || null
        };
    }
}