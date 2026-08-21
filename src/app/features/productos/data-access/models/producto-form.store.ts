import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { ProductoApiService } from '../producto-api.service';
import { ProductoCategoria, ProductoMarca } from './producto-catalog.models';
import { ProductoDetail } from './producto-read.models';
import { ProductoCreateRequest, ProductoUpdateRequest, ProductoWriteResponse } from './producto-write.models';

@Injectable()
export class ProductoFormStore {
    private readonly api = inject(ProductoApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly categoriasSignal = signal<readonly ProductoCategoria[]>([]);
    private readonly marcasSignal = signal<readonly ProductoMarca[]>([]);
    private readonly detailSignal = signal<ProductoDetail | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly loadErrorSignal = signal<string | null>(null);
    private readonly savingSignal = signal(false);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<ProductoWriteResponse | null>(null);

    readonly categorias = this.categoriasSignal.asReadonly();
    readonly marcas = this.marcasSignal.asReadonly();
    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly loadError = this.loadErrorSignal.asReadonly();
    readonly saving = this.savingSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();

    initialize(idProducto: number | null): void {
        this.loadingSignal.set(true); this.loadErrorSignal.set(null); this.detailSignal.set(null);

        if (idProducto === null) {
            forkJoin({ categorias: this.api.getCategorias(), marcas: this.api.getMarcas() })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: result => {
                        this.categoriasSignal.set(result.categorias); this.marcasSignal.set(result.marcas); this.loadingSignal.set(false);
                    },
                    error: error => {
                        this.loadingSignal.set(false);
                        this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la información del producto.'));
                    }
                });
            return;
        }

        forkJoin({ categorias: this.api.getCategorias(), marcas: this.api.getMarcas(), detail: this.api.getById(idProducto) })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.categoriasSignal.set(result.categorias); this.marcasSignal.set(result.marcas); this.detailSignal.set(result.detail); this.loadingSignal.set(false);
                },
                error: error => {
                    this.loadingSignal.set(false);
                    this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la información del producto.'));
                }
            });
    }

    create(request: ProductoCreateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.create(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar el producto.')); }
        });
    }

    update(idProducto: number, request: ProductoUpdateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.update(idProducto, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo actualizar el producto.')); }
        });
    }

    clearSaveResult(): void { this.saveResultSignal.set(null); }
    clearSaveError(): void { this.saveErrorSignal.set(null); }
}
