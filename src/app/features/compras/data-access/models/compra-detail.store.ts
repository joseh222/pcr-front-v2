import { Injectable, inject, signal } from '@angular/core';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { CompraApiService } from '../compra-api.service';
import { CompraDetailResponse } from './compra-read.models';

@Injectable()
export class CompraDetailStore {
    private readonly api = inject(CompraApiService);
    private readonly detailSignal = signal<CompraDetailResponse | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);

    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();

    load(idCompra: number): void {
        this.loadingSignal.set(true); this.errorSignal.set(null);
        this.api.getById(idCompra).subscribe({
            next: detail => { this.detailSignal.set(detail); this.loadingSignal.set(false); },
            error: error => { this.detailSignal.set(null); this.loadingSignal.set(false); this.errorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la compra.')); }
        });
    }
}
