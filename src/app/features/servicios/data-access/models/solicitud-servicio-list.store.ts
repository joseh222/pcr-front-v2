import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { SolicitudServicioApiService } from '../solicitud-servicio-api.service';
import { EstadoPagoSolicitudServicio, EstadoSolicitudServicio } from './solicitud-servicio-catalog.models';
import { ServicioListItem } from './servicio-lookup.models';
import { SolicitudServicioListFilters, SolicitudServicioListQuery, SolicitudServicioPagedResponse } from './solicitud-servicio-read.models';

const PAGE_SIZE = 20;
const DEFAULT_FILTERS: SolicitudServicioListFilters = { search: null, idServicio: null, estadoSolicitud: null, estadoPago: null, requierePago: null, fechaInicio: null, fechaFin: null };
const INITIAL_QUERY: SolicitudServicioListQuery = { ...DEFAULT_FILTERS, pageNumber: 1, pageSize: PAGE_SIZE };
const INITIAL_RESPONSE: SolicitudServicioPagedResponse = { items: [], pageNumber: 1, pageSize: PAGE_SIZE, totalRecords: 0, totalPages: 0 };

@Injectable()
export class SolicitudServicioListStore {
    private readonly api = inject(SolicitudServicioApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly querySignal = signal<SolicitudServicioListQuery>(INITIAL_QUERY);
    private readonly responseSignal = signal<SolicitudServicioPagedResponse>(INITIAL_RESPONSE);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);
    private readonly serviciosSignal = signal<readonly ServicioListItem[]>([]);
    private readonly estadosSignal = signal<readonly EstadoSolicitudServicio[]>([]);
    private readonly estadosPagoSignal = signal<readonly EstadoPagoSolicitudServicio[]>([]);
    private readonly catalogsLoadingSignal = signal(false);
    private readonly catalogsErrorSignal = signal<string | null>(null);
    private readonly catalogsLoadedSignal = signal(false);
    private readonly loadRequests = new Subject<SolicitudServicioListQuery>();

    readonly query = this.querySignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();
    readonly servicios = this.serviciosSignal.asReadonly();
    readonly estados = this.estadosSignal.asReadonly();
    readonly estadosPago = this.estadosPagoSignal.asReadonly();
    readonly catalogsLoading = this.catalogsLoadingSignal.asReadonly();
    readonly catalogsError = this.catalogsErrorSignal.asReadonly();
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
                catchError(error => of({ response: null, error: getApiErrorMessage(error, 'No se pudieron cargar las solicitudes de servicio.') }))
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
        forkJoin({ servicios: this.api.getServicios(), estados: this.api.getEstados(), estadosPago: this.api.getEstadosPago() })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.serviciosSignal.set(result.servicios.items);
                    this.estadosSignal.set(result.estados);
                    this.estadosPagoSignal.set(result.estadosPago);
                    this.catalogsLoadedSignal.set(true); this.catalogsLoadingSignal.set(false);
                },
                error: error => {
                    this.catalogsLoadingSignal.set(false);
                    this.catalogsErrorSignal.set(getApiErrorMessage(error, 'No se pudieron cargar los catálogos de servicios.'));
                }
            });
    }

    load(): void { this.requestLoad(); }
    reload(): void { this.requestLoad(); }
    search(filters: SolicitudServicioListFilters): void {
        this.querySignal.update(query => ({ ...this.normalize(filters), pageNumber: 1, pageSize: query.pageSize }));
        this.requestLoad();
    }
    resetFilters(): void {
        this.querySignal.update(query => ({ ...DEFAULT_FILTERS, pageNumber: 1, pageSize: query.pageSize }));
        this.requestLoad();
    }
    changePage(pageNumber: number): void {
        if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber === this.pageNumber()) return;
        this.querySignal.update(query => ({ ...query, pageNumber })); this.requestLoad();
    }
    changePageSize(pageSize: number): void {
        if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100 || pageSize === this.pageSize()) return;
        this.querySignal.update(query => ({ ...query, pageNumber: 1, pageSize })); this.requestLoad();
    }

    private requestLoad(): void { this.loadRequests.next(this.querySignal()); }
    private normalize(filters: SolicitudServicioListFilters): SolicitudServicioListFilters {
        return {
            search: filters.search?.trim() || null,
            idServicio: filters.idServicio ?? null,
            estadoSolicitud: filters.estadoSolicitud?.trim() || null,
            estadoPago: filters.estadoPago?.trim() || null,
            requierePago: filters.requierePago ?? null,
            fechaInicio: filters.fechaInicio || null,
            fechaFin: filters.fechaFin || null
        };
    }
}
