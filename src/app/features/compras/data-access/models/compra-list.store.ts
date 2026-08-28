import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { ProveedorSearchItem } from '../../../proveedores/data-access/models/proveedor-read.models';
import { CompraApiService } from '../compra-api.service';
import { EstadoCompra, TipoComprobanteCompra } from './compra-catalog.models';
import { CompraListFilters, CompraListQuery, CompraPagedResponse } from './compra-read.models';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_FILTERS: CompraListFilters = { search: null, idProveedor: null, idTipoComprobanteCompra: null, idEstadoCompra: null, fechaInicio: null, fechaFin: null };
const INITIAL_QUERY: CompraListQuery = { ...DEFAULT_FILTERS, pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE };
const INITIAL_RESPONSE: CompraPagedResponse = { pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE, totalRows: 0, totalPages: 0, items: [] };

@Injectable()
export class CompraListStore {
    private readonly api = inject(CompraApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly querySignal = signal<CompraListQuery>(INITIAL_QUERY);
    private readonly responseSignal = signal<CompraPagedResponse>(INITIAL_RESPONSE);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);
    private readonly estadosSignal = signal<readonly EstadoCompra[]>([]);
    private readonly tiposComprobanteSignal = signal<readonly TipoComprobanteCompra[]>([]);
    private readonly catalogsLoadingSignal = signal(false);
    private readonly catalogsLoadedSignal = signal(false);
    private readonly catalogsErrorSignal = signal<string | null>(null);
    private readonly proveedorResultsSignal = signal<readonly ProveedorSearchItem[]>([]);
    private readonly proveedorLoadingSignal = signal(false);
    private readonly proveedorErrorSignal = signal<string | null>(null);
    private readonly loadRequests = new Subject<CompraListQuery>();

    readonly query = this.querySignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();
    readonly estados = this.estadosSignal.asReadonly();
    readonly tiposComprobante = this.tiposComprobanteSignal.asReadonly();
    readonly catalogsLoading = this.catalogsLoadingSignal.asReadonly();
    readonly catalogsError = this.catalogsErrorSignal.asReadonly();
    readonly proveedorResults = this.proveedorResultsSignal.asReadonly();
    readonly proveedorLoading = this.proveedorLoadingSignal.asReadonly();
    readonly proveedorError = this.proveedorErrorSignal.asReadonly();
    readonly items = computed(() => this.responseSignal().items);
    readonly pageNumber = computed(() => this.querySignal().pageNumber);
    readonly pageSize = computed(() => this.querySignal().pageSize);
    readonly totalRows = computed(() => this.responseSignal().totalRows);
    readonly totalPages = computed(() => this.responseSignal().totalPages);
    readonly isEmpty = computed(() => !this.loading() && !this.error() && this.items().length === 0);

    constructor() {
        this.loadRequests.pipe(
            tap(() => { this.loadingSignal.set(true); this.errorSignal.set(null); }),
            switchMap(query => this.api.getList(query).pipe(
                map(response => ({ response, error: null })),
                catchError(error => of({ response: null, error: getApiErrorMessage(error, 'No se pudieron cargar las compras.') }))
            )),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            this.loadingSignal.set(false);
            if (result.response) { this.responseSignal.set(result.response); return; }
            this.errorSignal.set(result.error);
        });
    }

    loadCatalogs(): void {
        if (this.catalogsLoadedSignal() || this.catalogsLoadingSignal()) return;
        this.catalogsLoadingSignal.set(true); this.catalogsErrorSignal.set(null);
        forkJoin({ estados: this.api.getEstados(), tipos: this.api.getTiposComprobante() }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.estadosSignal.set(result.estados); this.tiposComprobanteSignal.set(result.tipos); this.catalogsLoadedSignal.set(true); this.catalogsLoadingSignal.set(false); },
            error: error => { this.catalogsLoadingSignal.set(false); this.catalogsErrorSignal.set(getApiErrorMessage(error, 'No se pudieron cargar los filtros de compras.')); }
        });
    }

    searchProveedores(search: string): void {
        const value = search.trim();
        if (value.length < 2) { this.proveedorResultsSignal.set([]); this.proveedorErrorSignal.set(null); return; }
        this.proveedorLoadingSignal.set(true); this.proveedorErrorSignal.set(null);
        this.api.searchProveedores(value, 10).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.proveedorResultsSignal.set(result); this.proveedorLoadingSignal.set(false); },
            error: error => { this.proveedorResultsSignal.set([]); this.proveedorLoadingSignal.set(false); this.proveedorErrorSignal.set(getApiErrorMessage(error, 'No se pudieron buscar proveedores.')); }
        });
    }

    clearProveedorResults(): void { this.proveedorResultsSignal.set([]); this.proveedorErrorSignal.set(null); }
    load(): void { this.requestLoad(); }
    reload(): void { this.requestLoad(); }
    search(filters: CompraListFilters): void { this.querySignal.update(query => ({ ...this.normalize(filters), pageNumber: 1, pageSize: query.pageSize })); this.requestLoad(); }
    resetFilters(): void { this.querySignal.update(query => ({ ...DEFAULT_FILTERS, pageNumber: 1, pageSize: query.pageSize })); this.requestLoad(); }
    changePage(pageNumber: number): void { if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber === this.pageNumber()) return; this.querySignal.update(query => ({ ...query, pageNumber })); this.requestLoad(); }
    changePageSize(pageSize: number): void { if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100 || pageSize === this.pageSize()) return; this.querySignal.update(query => ({ ...query, pageNumber: 1, pageSize })); this.requestLoad(); }

    private requestLoad(): void { this.loadRequests.next(this.querySignal()); }
    private normalize(filters: CompraListFilters): CompraListFilters {
        return { search: filters.search?.trim() || null, idProveedor: filters.idProveedor ?? null, idTipoComprobanteCompra: filters.idTipoComprobanteCompra ?? null, idEstadoCompra: filters.idEstadoCompra ?? null, fechaInicio: filters.fechaInicio || null, fechaFin: filters.fechaFin || null };
    }
}
