import { Injectable, inject, signal } from '@angular/core';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { SolicitudServicioApiService } from '../solicitud-servicio-api.service';
import { SolicitudServicioDetailResponse } from './solicitud-servicio-read.models';

@Injectable()
export class SolicitudServicioDetailStore {
    private readonly api = inject(SolicitudServicioApiService);
    private readonly detailSignal = signal<SolicitudServicioDetailResponse | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);

    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();

    load(idSolicitudServicio: number): void {
        this.loadingSignal.set(true); this.errorSignal.set(null);
        this.api.getById(idSolicitudServicio).subscribe({
            next: detail => { this.detailSignal.set(detail); this.loadingSignal.set(false); },
            error: error => { this.detailSignal.set(null); this.loadingSignal.set(false); this.errorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la solicitud de servicio.')); }
        });
    }
}
