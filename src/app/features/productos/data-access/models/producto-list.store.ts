import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { ProductoApiService } from '../producto-api.service';
import { ProductoCategoria, ProductoMarca } from './producto-catalog.models';
import { ProductoListFilters, ProductoListQuery, ProductoPagedResponse } from './producto-read.models';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_FILTERS: ProductoListFilters = { search: null, idCategoriaProducto: null, idMarcaProducto: null, isActive: true };
const INITIAL_QUERY: ProductoListQuery = { ...DEFAULT_FILTERS, pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE };
const INITIAL_RESPONSE: ProductoPagedResponse = { items: [], pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE, totalRecords: 0, totalPages: 0 };

@Injectable()
export class ProductoListStore {
    private readonly api = inject(ProductoApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly querySignal = signal<ProductoListQuery>(INITIAL_QUERY);
    private readonly responseSignal = signal<ProductoPagedResponse>(INITIAL_RESPONSE);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);
    private readonly categoriasSignal = signal<readonly ProductoCategoria[]>([]);
    private readonly marcasSignal = signal<readonly ProductoMarca[]>([]);
    private readonly catalogsLoadingSignal = signal(false);
    private readonly catalogsLoadedSignal = signal(false);
    private readonly catalogsErrorSignal = signal<string | null>(null);
    private readonly loadRequests = new Subject<ProductoListQuery>();

    readonly query = this.querySignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();
    readonly categorias = this.categoriasSignal.asReadonly();
    readonly marcas = this.marcasSignal.asReadonly();
    readonly catalogsLoading = this.catalogsLoadingSignal.asReadonly();
    readonly catalogsError = this.catalogsErrorSignal.asReadonly();
    readonly items = computed(() => this.responseSignal().items);
    readonly pageNumber = computed(() => this.querySignal().pageNumber);
    readonly pageSize = computed(() => this.querySignal().pageSize);
    readonly totalRecords = computed(() => this.responseSignal().totalRecords);
    readonly totalPages = computed(() => this.responseSignal().totalPages);
    readonly isEmpty = computed(() => !this.loading() && !this.error() && this.items().length === 0);

    constructor() {
        this.loadRequests.pipe(
            tap(() => { this.loadingSignal.set(true); this.errorSignal.set(null); }),
            switchMap(query => this.api.getList(query).pipe(
                map(response => ({ response, error: null })),
                catchError(error => of({ response: null, error: getApiErrorMessage(error, 'No se pudieron cargar los productos.') }))
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
        forkJoin({ categorias: this.api.getCategorias(), marcas: this.api.getMarcas() })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.categoriasSignal.set(result.categorias); this.marcasSignal.set(result.marcas);
                    this.catalogsLoadedSignal.set(true); this.catalogsLoadingSignal.set(false);
                },
                error: error => {
                    this.catalogsLoadingSignal.set(false);
                    this.catalogsErrorSignal.set(getApiErrorMessage(error, 'No se pudieron cargar los catálogos de productos.'));
                }
            });
    }

    load(): void { this.requestLoad(); }
    reload(): void { this.requestLoad(); }
    search(filters: ProductoListFilters): void {
        this.querySignal.update(query => ({ ...this.normalize(filters), pageNumber: 1, pageSize: query.pageSize }));
        this.requestLoad();
    }
    resetFilters(): void {
        this.querySignal.update(query => ({ ...DEFAULT_FILTERS, pageNumber: 1, pageSize: query.pageSize }));
        this.requestLoad();
    }
    changePage(pageNumber: number): void {
        if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber === this.querySignal().pageNumber) return;
        this.querySignal.update(query => ({ ...query, pageNumber })); this.requestLoad();
    }
    changePageSize(pageSize: number): void {
        if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100 || pageSize === this.querySignal().pageSize) return;
        this.querySignal.update(query => ({ ...query, pageNumber: 1, pageSize })); this.requestLoad();
    }

    private requestLoad(): void { this.loadRequests.next(this.querySignal()); }
    private normalize(filters: ProductoListFilters): ProductoListFilters {
        return { search: filters.search?.trim() || null, idCategoriaProducto: filters.idCategoriaProducto ?? null, idMarcaProducto: filters.idMarcaProducto ?? null, isActive: filters.isActive ?? null };
    }
}
