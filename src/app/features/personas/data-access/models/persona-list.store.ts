import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { PersonaApiService } from '../persona-api.service';
import { PersonaListFilters, PersonaListQuery, PersonaPagedResponse, PersonaRolCatalogo, PersonaTipoDocumento } from './persona-api.models';

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_FILTERS: PersonaListFilters = { search: null, idTipoDocumento: null, idRolPersona: null, isActive: true };
const INITIAL_QUERY: PersonaListQuery = { ...DEFAULT_FILTERS, pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE };
const INITIAL_RESPONSE: PersonaPagedResponse = { items: [], pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE, totalRecords: 0, totalPages: 0 };

@Injectable()
export class PersonaListStore {
    private readonly api = inject(PersonaApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly querySignal = signal<PersonaListQuery>(INITIAL_QUERY);
    private readonly responseSignal = signal<PersonaPagedResponse>(INITIAL_RESPONSE);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);
    private readonly tiposDocumentoSignal = signal<readonly PersonaTipoDocumento[]>([]);
    private readonly rolesSignal = signal<readonly PersonaRolCatalogo[]>([]);
    private readonly catalogsLoadingSignal = signal(false);
    private readonly catalogsLoadedSignal = signal(false);
    private readonly catalogsErrorSignal = signal<string | null>(null);
    private readonly loadRequests = new Subject<PersonaListQuery>();

    readonly query = this.querySignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();
    readonly tiposDocumento = this.tiposDocumentoSignal.asReadonly();
    readonly roles = this.rolesSignal.asReadonly();
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
                catchError(error => of({ response: null, error: getApiErrorMessage(error, 'No se pudieron cargar las personas.') }))
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
        forkJoin({ tiposDocumento: this.api.getTiposDocumento(), roles: this.api.getRoles() })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.tiposDocumentoSignal.set(result.tiposDocumento); this.rolesSignal.set(result.roles);
                    this.catalogsLoadedSignal.set(true); this.catalogsLoadingSignal.set(false);
                },
                error: error => {
                    this.catalogsLoadingSignal.set(false);
                    this.catalogsErrorSignal.set(getApiErrorMessage(error, 'No se pudieron cargar los catálogos de personas.'));
                }
            });
    }

    load(): void { this.requestLoad(); }
    reload(): void { this.requestLoad(); }
    search(filters: PersonaListFilters): void {
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
    private normalize(filters: PersonaListFilters): PersonaListFilters {
        return {
            search: filters.search?.trim() || null,
            idTipoDocumento: filters.idTipoDocumento ?? null,
            idRolPersona: filters.idRolPersona ?? null,
            isActive: filters.isActive ?? null
        };
    }
}
