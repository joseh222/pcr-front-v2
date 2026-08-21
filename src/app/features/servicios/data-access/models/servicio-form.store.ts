import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { ServicioApiService } from '../servicio-api.service';
import { CategoriaServicio } from './servicio-catalog.models';
import { ServicioDetail } from './servicio-read.models';
import { ServicioCreateRequest, ServicioUpdateRequest, ServicioWriteResponse } from './servicio-write.models';

@Injectable()
export class ServicioFormStore {
    private readonly api = inject(ServicioApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly categoriasSignal = signal<readonly CategoriaServicio[]>([]);
    private readonly detailSignal = signal<ServicioDetail | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly loadErrorSignal = signal<string | null>(null);
    private readonly savingSignal = signal(false);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<ServicioWriteResponse | null>(null);

    readonly categorias = this.categoriasSignal.asReadonly();
    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly loadError = this.loadErrorSignal.asReadonly();
    readonly saving = this.savingSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();

    initialize(idServicio: number | null): void {
        this.loadingSignal.set(true); this.loadErrorSignal.set(null); this.detailSignal.set(null);

        if (idServicio === null) {
            this.api.getCategorias().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: categorias => { this.categoriasSignal.set(categorias); this.loadingSignal.set(false); },
                error: error => {
                    this.loadingSignal.set(false);
                    this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la información del servicio.'));
                }
            });
            return;
        }

        forkJoin({ categorias: this.api.getCategorias(), detail: this.api.getById(idServicio) })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.categoriasSignal.set(result.categorias);
                    this.detailSignal.set(result.detail);
                    this.loadingSignal.set(false);
                },
                error: error => {
                    this.loadingSignal.set(false);
                    this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la información del servicio.'));
                }
            });
    }

    create(request: ServicioCreateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.create(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar el servicio.')); }
        });
    }

    update(idServicio: number, request: ServicioUpdateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.update(idServicio, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo actualizar el servicio.')); }
        });
    }

    clearSaveResult(): void { this.saveResultSignal.set(null); }
    clearSaveError(): void { this.saveErrorSignal.set(null); }
}
