import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { ProveedorApiService } from '../proveedor-api.service';
import { ProveedorTipoDocumento } from './proveedor-catalog.models';
import { ProveedorDetail } from './proveedor-read.models';
import { ProveedorCreateRequest, ProveedorUpdateRequest, ProveedorWriteResponse } from './proveedor-write.models';

@Injectable()
export class ProveedorFormStore {
    private readonly api = inject(ProveedorApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly tiposDocumentoSignal = signal<readonly ProveedorTipoDocumento[]>([]);
    private readonly detailSignal = signal<ProveedorDetail | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly loadErrorSignal = signal<string | null>(null);
    private readonly savingSignal = signal(false);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<ProveedorWriteResponse | null>(null);

    readonly tiposDocumento = this.tiposDocumentoSignal.asReadonly();
    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly loadError = this.loadErrorSignal.asReadonly();
    readonly saving = this.savingSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();

    initialize(idProveedor: number | null): void {
        this.loadingSignal.set(true); this.loadErrorSignal.set(null); this.detailSignal.set(null);

        if (idProveedor === null) {
            this.api.getTiposDocumento().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: tipos => { this.tiposDocumentoSignal.set(tipos); this.loadingSignal.set(false); },
                error: error => { this.loadingSignal.set(false); this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la información del proveedor.')); }
            });
            return;
        }

        forkJoin({ tipos: this.api.getTiposDocumento(), detail: this.api.getById(idProveedor) })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => { this.tiposDocumentoSignal.set(result.tipos); this.detailSignal.set(result.detail); this.loadingSignal.set(false); },
                error: error => { this.loadingSignal.set(false); this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la información del proveedor.')); }
            });
    }

    create(request: ProveedorCreateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.create(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar el proveedor.')); }
        });
    }

    update(idProveedor: number, request: ProveedorUpdateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.update(idProveedor, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo actualizar el proveedor.')); }
        });
    }

    clearSaveResult(): void { this.saveResultSignal.set(null); }
    clearSaveError(): void { this.saveErrorSignal.set(null); }
}
