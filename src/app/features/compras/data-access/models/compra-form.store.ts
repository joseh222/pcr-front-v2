import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { ProductoSearchItem } from '../../../productos/data-access/models/producto-read.models';
import { ProveedorSearchItem } from '../../../proveedores/data-access/models/proveedor-read.models';
import { CompraApiService } from '../compra-api.service';
import { TipoComprobanteCompra } from './compra-catalog.models';
import { CompraAddProductResult, CompraFormItem } from './compra-form.models';
import { CompraCreateRequest, CompraCreateResponse } from './compra-write.models';

@Injectable()
export class CompraFormStore {
    private readonly api = inject(CompraApiService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly tiposComprobanteSignal = signal<readonly TipoComprobanteCompra[]>([]);
    private readonly loadingSignal = signal(false);
    private readonly loadErrorSignal = signal<string | null>(null);
    private readonly proveedorResultsSignal = signal<readonly ProveedorSearchItem[]>([]);
    private readonly proveedorLoadingSignal = signal(false);
    private readonly proveedorErrorSignal = signal<string | null>(null);
    private readonly selectedProveedorSignal = signal<ProveedorSearchItem | null>(null);
    private readonly productoResultsSignal = signal<readonly ProductoSearchItem[]>([]);
    private readonly productoLoadingSignal = signal(false);
    private readonly productoErrorSignal = signal<string | null>(null);
    private readonly itemsSignal = signal<readonly CompraFormItem[]>([]);
    private readonly savingSignal = signal(false);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<CompraCreateResponse | null>(null);
    private proveedorSearchVersion = 0;
    private productoSearchVersion = 0;

    readonly tiposComprobante = this.tiposComprobanteSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly loadError = this.loadErrorSignal.asReadonly();
    readonly proveedorResults = this.proveedorResultsSignal.asReadonly();
    readonly proveedorLoading = this.proveedorLoadingSignal.asReadonly();
    readonly proveedorError = this.proveedorErrorSignal.asReadonly();
    readonly selectedProveedor = this.selectedProveedorSignal.asReadonly();
    readonly productoResults = this.productoResultsSignal.asReadonly();
    readonly productoLoading = this.productoLoadingSignal.asReadonly();
    readonly productoError = this.productoErrorSignal.asReadonly();
    readonly items = this.itemsSignal.asReadonly();
    readonly saving = this.savingSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();
    readonly total = computed(() => Math.round(this.itemsSignal().reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100);
    readonly hasInvalidItems = computed(() => this.itemsSignal().some(item => item.cantidadError !== null || item.costoError !== null));

    initialize(): void {
        this.loadingSignal.set(true); this.loadErrorSignal.set(null);
        this.api.getTiposComprobante().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: tipos => { this.tiposComprobanteSignal.set(tipos.filter(tipo => tipo.isActive)); this.loadingSignal.set(false); },
            error: error => { this.loadingSignal.set(false); this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudieron cargar los tipos de comprobante.')); }
        });
    }

    searchProveedores(search: string): void {
        const term = search.trim(); const version = ++this.proveedorSearchVersion;
        this.proveedorErrorSignal.set(null);
        if (term.length < 2) { this.proveedorResultsSignal.set([]); this.proveedorLoadingSignal.set(false); return; }
        this.proveedorLoadingSignal.set(true);
        this.api.searchProveedores(term, 10).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { if (version !== this.proveedorSearchVersion) return; this.proveedorResultsSignal.set(result.filter(item => item.isActive)); this.proveedorLoadingSignal.set(false); },
            error: error => { if (version !== this.proveedorSearchVersion) return; this.proveedorLoadingSignal.set(false); this.proveedorErrorSignal.set(getApiErrorMessage(error, 'No se pudieron buscar proveedores.')); }
        });
    }

    selectProveedor(proveedor: ProveedorSearchItem): void { this.selectedProveedorSignal.set(proveedor); this.proveedorResultsSignal.set([]); }
    clearProveedor(): void { this.selectedProveedorSignal.set(null); this.proveedorResultsSignal.set([]); }

    searchProductos(search: string): void {
        const term = search.trim(); const version = ++this.productoSearchVersion;
        this.productoErrorSignal.set(null);
        if (term.length < 2) { this.productoResultsSignal.set([]); this.productoLoadingSignal.set(false); return; }
        this.productoLoadingSignal.set(true);
        this.api.searchProductos(term, 10).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { if (version !== this.productoSearchVersion) return; this.productoResultsSignal.set(result); this.productoLoadingSignal.set(false); },
            error: error => { if (version !== this.productoSearchVersion) return; this.productoLoadingSignal.set(false); this.productoErrorSignal.set(getApiErrorMessage(error, 'No se pudieron buscar productos.')); }
        });
    }

    addProduct(product: ProductoSearchItem): CompraAddProductResult {
        if (this.itemsSignal().some(item => item.idProducto === product.idProducto)) return 'DUPLICATE';
        if (this.itemsSignal().length >= 100) return 'LIMIT';

        this.productoErrorSignal.set(null); this.productoLoadingSignal.set(true);
        this.api.getProductoById(product.idProducto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: detail => {
                this.productoLoadingSignal.set(false);
                if (this.itemsSignal().some(item => item.idProducto === detail.idProducto)) return;
                const costo = detail.precioCompra ?? 0;
                this.itemsSignal.update(items => [...items, {
                    idProducto: detail.idProducto, codProducto: detail.codProducto, nombre: detail.nombre, sku: detail.sku,
                    cantidad: 1, costoUnitario: costo, subtotal: costo, cantidadError: null, costoError: null
                }]);
                this.productoResultsSignal.set([]);
            },
            error: error => { this.productoLoadingSignal.set(false); this.productoErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar el producto seleccionado.')); }
        });
        return 'ADDED';
    }

    updateQuantity(idProducto: number, value: number): void {
        this.itemsSignal.update(items => items.map(item => {
            if (item.idProducto !== idProducto) return item;
            const error = !Number.isFinite(value) || value <= 0 ? 'La cantidad debe ser mayor que cero.' : null;
            return { ...item, cantidad: value, cantidadError: error, subtotal: error ? 0 : this.round(value * item.costoUnitario) };
        }));
    }

    updateCost(idProducto: number, value: number): void {
        this.itemsSignal.update(items => items.map(item => {
            if (item.idProducto !== idProducto) return item;
            const error = !Number.isFinite(value) || value < 0 ? 'El costo no puede ser negativo.' : null;
            return { ...item, costoUnitario: value, costoError: error, subtotal: error || item.cantidadError ? 0 : this.round(item.cantidad * value) };
        }));
    }

    removeProduct(idProducto: number): void { this.itemsSignal.update(items => items.filter(item => item.idProducto !== idProducto)); }

    create(request: CompraCreateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.create(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar la compra.')); }
        });
    }

    reset(): void {
        this.selectedProveedorSignal.set(null); this.proveedorResultsSignal.set([]); this.productoResultsSignal.set([]); this.itemsSignal.set([]);
        this.saveErrorSignal.set(null); this.saveResultSignal.set(null); this.productoErrorSignal.set(null); this.proveedorErrorSignal.set(null);
    }

    clearSaveResult(): void { this.saveResultSignal.set(null); }
    private round(value: number): number { return Math.round(value * 100) / 100; }
}
