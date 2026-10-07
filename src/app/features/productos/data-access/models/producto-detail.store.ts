import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { InventarioApiService } from '../../../inventario/data-access/inventario-api.service';
import { InventarioProducto } from '../../../inventario/data-access/models/inventario.models';
import { ProductoApiService } from '../producto-api.service';
import { ProductoDetail } from './producto-read.models';

@Injectable()
export class ProductoDetailStore {
    private readonly productoApi = inject(ProductoApiService); private readonly inventarioApi = inject(InventarioApiService); private readonly destroyRef = inject(DestroyRef);
    private readonly detailSignal = signal<ProductoDetail | null>(null); private readonly inventorySignal = signal<InventarioProducto | null>(null); private readonly loadingSignal = signal(false); private readonly errorSignal = signal<string | null>(null);
    readonly detail = this.detailSignal.asReadonly(); readonly inventory = this.inventorySignal.asReadonly(); readonly loading = this.loadingSignal.asReadonly(); readonly error = this.errorSignal.asReadonly();

    load(idProducto: number, includeInventory = true): void {
        this.loadingSignal.set(true); this.errorSignal.set(null); this.inventorySignal.set(null);
        if (!includeInventory) {
            this.productoApi.getById(idProducto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: detail => { this.detailSignal.set(detail); this.loadingSignal.set(false); },
                error: error => { this.loadingSignal.set(false); this.errorSignal.set(getApiErrorMessage(error, 'No se pudo cargar el producto.')); }
            });
            return;
        }
        forkJoin({ detail: this.productoApi.getById(idProducto), inventory: this.inventarioApi.getByProducto(idProducto) }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.detailSignal.set(result.detail); this.inventorySignal.set(result.inventory); this.loadingSignal.set(false); },
            error: error => { this.loadingSignal.set(false); this.errorSignal.set(getApiErrorMessage(error, 'No se pudo cargar el producto.')); }
        });
    }
}
