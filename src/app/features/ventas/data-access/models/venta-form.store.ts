import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';

import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { PersonaLookup, PersonaCreateRequest, PersonaCreateResponse, PersonaSearchItem, PersonaTipoDocumento } from '../../../personas/data-access/models/persona-api.models';
import { VentaApiService } from '../venta-api.service';
import { VentaMetodoPago, VentaTipoComprobante } from './venta-catalog.models';
import { VentaFormItem } from './venta-form.models';
import { VentaProductoBusqueda, VentaSolicitudDetalle, VentaSolicitudPendiente } from './venta-lookup.models';
import { VentaCreateRequest, VentaCreateResponse } from './venta-write.models';

@Injectable()
export class VentaFormStore {
    private readonly api = inject(VentaApiService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);
    private readonly metodosPagoSignal = signal<readonly VentaMetodoPago[]>([]);
    private readonly tiposComprobanteSignal = signal<readonly VentaTipoComprobante[]>([]);
    private readonly tiposDocumentoSignal = signal<readonly PersonaTipoDocumento[]>([]);
    private readonly initialServiceSignal = signal<VentaSolicitudDetalle | null>(null);
    private readonly initialPersonSignal = signal<PersonaLookup | null>(null);

    private readonly productResultsSignal = signal<readonly VentaProductoBusqueda[]>([]);
    private readonly productLoadingSignal = signal(false);
    private readonly productErrorSignal = signal<string | null>(null);
    private productSearchVersion = 0;

    private readonly serviceResultsSignal = signal<readonly VentaSolicitudPendiente[]>([]);
    private readonly serviceLoadingSignal = signal(false);
    private readonly serviceErrorSignal = signal<string | null>(null);
    private serviceSearchVersion = 0;

    private readonly personResultsSignal = signal<readonly PersonaSearchItem[]>([]);
    private readonly personLoadingSignal = signal(false);
    private readonly personErrorSignal = signal<string | null>(null);
    private personSearchVersion = 0;

    private readonly documentPersonSignal = signal<PersonaLookup | null>(null);
    private readonly documentLoadingSignal = signal(false);
    private readonly documentErrorSignal = signal<string | null>(null);
    private documentSearchVersion = 0;

    private readonly creatingPersonSignal = signal(false);
    private readonly createPersonErrorSignal = signal<string | null>(null);
    private readonly createdPersonSignal = signal<PersonaCreateResponse | null>(null);

    private readonly itemsSignal = signal<readonly VentaFormItem[]>([]);

    private readonly savingSignal = signal(false);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<VentaCreateResponse | null>(null);

    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();
    readonly metodosPago = this.metodosPagoSignal.asReadonly();
    readonly tiposComprobante = this.tiposComprobanteSignal.asReadonly();
    readonly tiposDocumento = this.tiposDocumentoSignal.asReadonly();
    readonly initialService = this.initialServiceSignal.asReadonly();
    readonly initialPerson = this.initialPersonSignal.asReadonly();

    readonly productResults = this.productResultsSignal.asReadonly();
    readonly productLoading = this.productLoadingSignal.asReadonly();
    readonly productError = this.productErrorSignal.asReadonly();
    readonly serviceResults = this.serviceResultsSignal.asReadonly();
    readonly serviceLoading = this.serviceLoadingSignal.asReadonly();
    readonly serviceError = this.serviceErrorSignal.asReadonly();
    readonly personResults = this.personResultsSignal.asReadonly();
    readonly personLoading = this.personLoadingSignal.asReadonly();
    readonly personError = this.personErrorSignal.asReadonly();
    readonly documentPerson = this.documentPersonSignal.asReadonly();
    readonly documentLoading = this.documentLoadingSignal.asReadonly();
    readonly documentError = this.documentErrorSignal.asReadonly();
    readonly creatingPerson = this.creatingPersonSignal.asReadonly();
    readonly createPersonError = this.createPersonErrorSignal.asReadonly();
    readonly createdPerson = this.createdPersonSignal.asReadonly();

    readonly items = this.itemsSignal.asReadonly();
    readonly hasInvalidItems = computed(() => this.itemsSignal().some(item => item.cantidadError !== null));
    readonly total = computed(() =>
        this.itemsSignal().reduce(
            (sum, item) => sum + (item.cantidadError ? 0 : item.subtotal), 0
        )
    );
    readonly saving = this.savingSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();

    initialize(initialServiceId: number | null): void {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.initialServiceSignal.set(null);
        this.initialPersonSignal.set(null);

        forkJoin({
            metodosPago: this.api.getMetodosPago(),
            tiposComprobante: this.api.getTiposComprobante(),
            tiposDocumento: this.api.getPersonaTiposDocumento(),
            initialService: initialServiceId ? this.api.getSolicitudById(initialServiceId) : of(null)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.metodosPagoSignal.set(result.metodosPago);
                    this.tiposComprobanteSignal.set(result.tiposComprobante);
                    this.tiposDocumentoSignal.set(result.tiposDocumento);

                    if (result.initialService) {
                        if (!this.isPayableService(result.initialService)) {
                            this.errorSignal.set('La solicitud indicada ya no se encuentra disponible para venta.');
                        } else {
                            this.initialServiceSignal.set(result.initialService);
                            this.addService(result.initialService);
                            if (result.initialService.idPersona) this.loadInitialPerson(result.initialService.idPersona);
                        }
                    }

                    this.loadingSignal.set(false);
                },
                error: error => {
                    this.loadingSignal.set(false);
                    this.errorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la información necesaria para registrar la venta.'));
                }
            });
    }

    searchProducts(search: string): void {
        const text = search.trim();
        const version = ++this.productSearchVersion;

        if (text.length < 2) {
            this.productResultsSignal.set([]);
            this.productLoadingSignal.set(false);
            this.productErrorSignal.set(null);
            return;
        }

        this.productLoadingSignal.set(true);
        this.productErrorSignal.set(null);

        this.api.searchProductos(text, 10)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    if (version !== this.productSearchVersion) return;
                    this.productResultsSignal.set(result);
                    this.productLoadingSignal.set(false);
                },
                error: error => {
                    if (version !== this.productSearchVersion) return;
                    this.productResultsSignal.set([]);
                    this.productLoadingSignal.set(false);
                    this.productErrorSignal.set(getApiErrorMessage(error, 'No se pudo buscar productos.'));
                }
            });
    }

    searchServices(search: string): void {
        const text = search.trim();
        const version = ++this.serviceSearchVersion;

        if (text.length < 2) {
            this.serviceResultsSignal.set([]);
            this.serviceLoadingSignal.set(false);
            this.serviceErrorSignal.set(null);
            return;
        }

        this.serviceLoadingSignal.set(true);
        this.serviceErrorSignal.set(null);

        this.api.searchServiciosPendientes(text, 20)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    if (version !== this.serviceSearchVersion) return;
                    this.serviceResultsSignal.set(result);
                    this.serviceLoadingSignal.set(false);
                },
                error: error => {
                    if (version !== this.serviceSearchVersion) return;
                    this.serviceResultsSignal.set([]);
                    this.serviceLoadingSignal.set(false);
                    this.serviceErrorSignal.set(getApiErrorMessage(error, 'No se pudo buscar servicios pendientes.'));
                }
            });
    }

    searchPersons(search: string): void {
        const text = search.trim();
        const version = ++this.personSearchVersion;

        if (text.length < 3) {
            this.personResultsSignal.set([]);
            this.personLoadingSignal.set(false);
            this.personErrorSignal.set(null);
            return;
        }

        this.personLoadingSignal.set(true);
        this.personErrorSignal.set(null);

        this.api.searchPersonas(text, 10)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    if (version !== this.personSearchVersion) return;
                    this.personResultsSignal.set(result);
                    this.personLoadingSignal.set(false);
                },
                error: error => {
                    if (version !== this.personSearchVersion) return;
                    this.personResultsSignal.set([]);
                    this.personLoadingSignal.set(false);
                    this.personErrorSignal.set(getApiErrorMessage(error, 'No se pudo buscar personas.'));
                }
            });
    }

    findPersonByDocument(idTipoDocumento: number, numeroDocumento: string): void {
        const version = ++this.documentSearchVersion;
        this.documentLoadingSignal.set(true);
        this.documentErrorSignal.set(null);
        this.documentPersonSignal.set(null);

        this.api.getPersonaByDocument(idTipoDocumento, numeroDocumento.trim())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: person => {
                    if (version !== this.documentSearchVersion) return;
                    this.documentPersonSignal.set(person);
                    this.documentLoadingSignal.set(false);
                },
                error: error => {
                    if (version !== this.documentSearchVersion) return;
                    this.documentLoadingSignal.set(false);
                    this.documentErrorSignal.set(getApiErrorMessage(error, 'No se pudo consultar la persona.'));
                }
            });
    }

    createPerson(request: PersonaCreateRequest): void {
        this.creatingPersonSignal.set(true);
        this.createPersonErrorSignal.set(null);
        this.createdPersonSignal.set(null);

        this.api.createPersona(request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.creatingPersonSignal.set(false);
                    this.createdPersonSignal.set(result);
                },
                error: error => {
                    this.creatingPersonSignal.set(false);
                    this.createPersonErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar la persona.'));
                }
            });
    }

    addProduct(product: VentaProductoBusqueda): boolean {
        if (this.itemsSignal().some(item => item.idProducto === product.idProducto)) return false;

        this.itemsSignal.update(items => [
            ...items,
            {
                key: `PRODUCTO-${product.idProducto}`,
                tipoItem: 'PRODUCTO',
                idProducto: product.idProducto,
                idSolicitudServicio: null,
                codigo: product.codProducto,
                referencia: product.sku,
                descripcion: product.nombre,
                solicitante: null,
                cantidad: 1,
                precioUnitario: product.precioVenta,
                stockActual: product.stockActual,
                subtotal: product.precioVenta,
                cantidadError: null
            }
        ]);
        this.clearProductSearch();
        return true;
    }

    addService(service: VentaSolicitudPendiente | VentaSolicitudDetalle): boolean {
        if (this.itemsSignal().some(item => item.idSolicitudServicio === service.idSolicitudServicio)) return false;

        this.itemsSignal.update(items => [
            ...items,
            {
                key: `SERVICIO-${service.idSolicitudServicio}`,
                tipoItem: 'SERVICIO',
                idProducto: null,
                idSolicitudServicio: service.idSolicitudServicio,
                codigo: service.codSolicitudServicio,
                referencia: service.codigoServicio,
                descripcion: service.nombreServicio,
                solicitante: service.nombreCompleto,
                cantidad: 1,
                precioUnitario: service.importe,
                stockActual: null,
                subtotal: service.importe,
                cantidadError: null
            }
        ]);
        this.clearServiceSearch();
        return true;
    }

    updateProductQuantity(idProducto: number, quantity: number): string | null {
        let validationMessage: string | null = null;

        this.itemsSignal.update(items =>
            items.map(item => {
                if (item.idProducto !== idProducto || item.tipoItem !== 'PRODUCTO') {
                    return item;
                }

                if (!Number.isFinite(quantity) || quantity <= 0) {
                    validationMessage = 'La cantidad debe ser mayor que cero.';

                    return {
                        ...item,
                        cantidad: quantity,
                        subtotal: 0,
                        cantidadError: validationMessage
                    };
                }

                if (item.stockActual !== null && quantity > item.stockActual) {
                    validationMessage = `Stock disponible: ${item.stockActual}.`;

                    return {
                        ...item,
                        cantidad: quantity,
                        subtotal: 0,
                        cantidadError: validationMessage
                    };
                }

                return {
                    ...item,
                    cantidad: quantity,
                    subtotal: Math.round(quantity * item.precioUnitario * 100) / 100,
                    cantidadError: null
                };
            })
        );

        return validationMessage;
    }

    removeItem(key: string): void {
        this.itemsSignal.update(items => items.filter(item => item.key !== key));
    }

    clearProductSearch(): void {
        this.productSearchVersion++;
        this.productResultsSignal.set([]);
        this.productLoadingSignal.set(false);
        this.productErrorSignal.set(null);
    }

    clearServiceSearch(): void {
        this.serviceSearchVersion++;
        this.serviceResultsSignal.set([]);
        this.serviceLoadingSignal.set(false);
        this.serviceErrorSignal.set(null);
    }

    clearPersonSearch(): void {
        this.personSearchVersion++;
        this.personResultsSignal.set([]);
        this.personLoadingSignal.set(false);
        this.personErrorSignal.set(null);
    }

    clearDocumentPerson(): void {
        this.documentSearchVersion++;
        this.documentPersonSignal.set(null);
        this.documentLoadingSignal.set(false);
        this.documentErrorSignal.set(null);
    }

    clearCreatedPerson(): void {
        this.createdPersonSignal.set(null);
        this.createPersonErrorSignal.set(null);
    }

    createSale(request: VentaCreateRequest): void {
        this.savingSignal.set(true);
        this.saveErrorSignal.set(null);
        this.saveResultSignal.set(null);

        this.api.create(request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.savingSignal.set(false);
                    this.saveResultSignal.set(result);
                },
                error: error => {
                    this.savingSignal.set(false);
                    this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar la venta.'));
                }
            });
    }

    clearSaveResult(): void {
        this.saveResultSignal.set(null);
        this.saveErrorSignal.set(null);
    }


    private loadInitialPerson(idPersona: number): void {
        this.api.getPersonaById(idPersona)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: person => this.initialPersonSignal.set(person),
                error: () => this.initialPersonSignal.set(null)
            });
    }

    private isPayableService(service: VentaSolicitudDetalle): boolean {
        return service.requierePago && service.estadoSolicitud === 'ACTIVA' && service.estadoPago === 'PENDIENTE';
    }
}
