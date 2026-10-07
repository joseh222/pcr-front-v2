import { Injectable, inject, signal } from '@angular/core';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { VentaApiService } from '../venta-api.service';
import { VentaDetailResponse } from './venta-read.models';

@Injectable()
export class VentaDetailStore {
    private readonly api = inject(VentaApiService);
    private readonly detailSignal = signal<VentaDetailResponse | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);

    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();

    load(idVenta: number): void {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        this.api.getById(idVenta).subscribe({
            next: result => {
                this.detailSignal.set(result);
                this.loadingSignal.set(false);
            },
            error: error => {
                this.detailSignal.set(null);
                this.loadingSignal.set(false);
                this.errorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la venta.'));
            }
        });
    }
}