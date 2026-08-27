import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { UsuarioApiService } from '../usuario-api.service';
import { UsuarioListFilters, UsuarioListQuery, UsuarioPagedResponse, UsuarioRole } from './usuario-api.models';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_FILTERS: UsuarioListFilters = { search: null, idRole: null, isActive: true };
const INITIAL_QUERY: UsuarioListQuery = { ...DEFAULT_FILTERS, pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE };
const INITIAL_RESPONSE: UsuarioPagedResponse = { items: [], pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE, totalRecords: 0, totalPages: 0 };

@Injectable()
export class UsuarioListStore {
    private readonly api = inject(UsuarioApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly querySignal = signal<UsuarioListQuery>(INITIAL_QUERY);
    private readonly responseSignal = signal<UsuarioPagedResponse>(INITIAL_RESPONSE);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);
    private readonly rolesSignal = signal<readonly UsuarioRole[]>([]);
    private readonly rolesLoadingSignal = signal(false);
    private readonly rolesErrorSignal = signal<string | null>(null);
    private readonly loadRequests = new Subject<UsuarioListQuery>();

    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();
    readonly roles = this.rolesSignal.asReadonly();
    readonly rolesLoading = this.rolesLoadingSignal.asReadonly();
    readonly rolesError = this.rolesErrorSignal.asReadonly();
    readonly items = computed(() => this.responseSignal().items);
    readonly pageNumber = computed(() => this.querySignal().pageNumber);
    readonly pageSize = computed(() => this.querySignal().pageSize);
    readonly totalRecords = computed(() => this.responseSignal().totalRecords);
    readonly isEmpty = computed(() => !this.loading() && !this.error() && this.items().length === 0);

    constructor() {
        this.loadRequests.pipe(
            tap(() => { this.loadingSignal.set(true); this.errorSignal.set(null); }),
            switchMap(query => this.api.getList(query).pipe(
                map(response => ({ response, error: null })),
                catchError(error => of({ response: null, error: getApiErrorMessage(error, 'No se pudieron cargar los usuarios.') }))
            )),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(result => {
            this.loadingSignal.set(false);
            if (result.response) { this.responseSignal.set(result.response); return; }
            this.errorSignal.set(result.error);
        });
    }

    loadRoles(): void {
        if (this.rolesLoadingSignal() || this.rolesSignal().length) return;
        this.rolesLoadingSignal.set(true); this.rolesErrorSignal.set(null);
        this.api.getRoles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: roles => { this.rolesSignal.set(roles); this.rolesLoadingSignal.set(false); },
            error: error => { this.rolesLoadingSignal.set(false); this.rolesErrorSignal.set(getApiErrorMessage(error, 'No se pudieron cargar los roles.')); }
        });
    }

    load(): void { this.loadRequests.next(this.querySignal()); }
    reload(): void { this.load(); }
    search(filters: UsuarioListFilters): void {
        this.querySignal.update(query => ({ ...this.normalize(filters), pageNumber: 1, pageSize: query.pageSize })); this.load();
    }
    resetFilters(): void {
        this.querySignal.update(query => ({ ...DEFAULT_FILTERS, pageNumber: 1, pageSize: query.pageSize })); this.load();
    }
    changePage(pageNumber: number): void {
        if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber === this.querySignal().pageNumber) return;
        this.querySignal.update(query => ({ ...query, pageNumber })); this.load();
    }
    changePageSize(pageSize: number): void {
        if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100 || pageSize === this.querySignal().pageSize) return;
        this.querySignal.update(query => ({ ...query, pageNumber: 1, pageSize })); this.load();
    }

    private normalize(filters: UsuarioListFilters): UsuarioListFilters {
        return { search: filters.search?.trim() || null, idRole: filters.idRole ?? null, isActive: filters.isActive ?? null };
    }
}
