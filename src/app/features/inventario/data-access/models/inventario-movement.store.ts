import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { InventarioApiService } from '../inventario-api.service';
import { InventarioProducto, MovimientoInventarioCreateRequest, MovimientoInventarioCreateResponse, TipoMovimientoInventario } from './inventario.models';

@Injectable()
export class InventarioMovementStore {
    private readonly api = inject(InventarioApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly tiposSignal = signal<readonly TipoMovimientoInventario[]>([]);
    private readonly inventorySignal = signal<InventarioProducto | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly loadErrorSignal = signal<string | null>(null);
    private readonly savingSignal = signal(false);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<MovimientoInventarioCreateResponse | null>(null);

    readonly tipos = this.tiposSignal.asReadonly();
    readonly inventory = this.inventorySignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly loadError = this.loadErrorSignal.asReadonly();
    readonly saving = this.savingSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();

    initialize(idProducto: number): void {
        this.loadingSignal.set(true); this.loadErrorSignal.set(null); this.inventorySignal.set(null);
        forkJoin({ tipos: this.api.getTiposMovimiento(), inventory: this.api.getByProducto(idProducto) })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => { this.tiposSignal.set(result.tipos); this.inventorySignal.set(result.inventory); this.loadingSignal.set(false); },
                error: error => { this.loadingSignal.set(false); this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la información de inventario.')); }
            });
    }

    create(idProducto: number, request: MovimientoInventarioCreateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.createMovimiento(idProducto, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar el movimiento de inventario.')); }
        });
    }

    clearSaveError(): void { this.saveErrorSignal.set(null); }
    clearSaveResult(): void { this.saveResultSignal.set(null); }
}
