import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { InventarioApiService } from '../inventario-api.service';
import { MovimientoInventarioListFilters, MovimientoInventarioListQuery, MovimientoInventarioPagedResponse } from './inventario.models';

const EMPTY: MovimientoInventarioPagedResponse = { items: [], pageNumber: 1, pageSize: 20, totalRecords: 0, totalPages: 0 };
const DEFAULT_FILTERS: MovimientoInventarioListFilters = { idProducto: null, idTipoMovimiento: null, fechaInicio: null, fechaFin: null };

@Injectable()
export class InventarioMovementListStore {
    private readonly api = inject(InventarioApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly querySignal = signal<MovimientoInventarioListQuery>({ ...DEFAULT_FILTERS, pageNumber: 1, pageSize: 20 });
    private readonly responseSignal = signal(EMPTY);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);
    private readonly requests = new Subject<MovimientoInventarioListQuery>();

    readonly query = this.querySignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();
    readonly items = computed(() => this.responseSignal().items);
    readonly pageNumber = computed(() => this.querySignal().pageNumber);
    readonly pageSize = computed(() => this.querySignal().pageSize);
    readonly totalRecords = computed(() => this.responseSignal().totalRecords);
    readonly totalPages = computed(() => this.responseSignal().totalPages);
    readonly isEmpty = computed(() => !this.loading() && !this.error() && this.items().length === 0);

    constructor() {
        this.requests.pipe(
            tap(() => { this.loadingSignal.set(true); this.errorSignal.set(null); }),
            switchMap(query => this.api.getMovimientos(query).pipe(
                map(response => ({ response, error: null })),
                catchError(error => of({ response: null, error: getApiErrorMessage(error, 'No se pudieron cargar los movimientos de inventario.') }))
            )),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            this.loadingSignal.set(false);
            if (result.response) this.responseSignal.set(result.response);
            else this.errorSignal.set(result.error);
        });
    }

    load(): void { this.request(); }
    reload(): void { this.request(); }
    search(filters: MovimientoInventarioListFilters): void { this.querySignal.update(q => ({ ...filters, pageNumber: 1, pageSize: q.pageSize })); this.request(); }
    changePage(pageNumber: number): void { if (pageNumber < 1 || pageNumber === this.pageNumber()) return; this.querySignal.update(q => ({ ...q, pageNumber })); this.request(); }
    changePageSize(pageSize: number): void { if (pageSize < 1 || pageSize > 100 || pageSize === this.pageSize()) return; this.querySignal.update(q => ({ ...q, pageNumber: 1, pageSize })); this.request(); }
    private request(): void { this.requests.next(this.querySignal()); }
}
