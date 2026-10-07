import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { getApiErrorMessage } from '../../../core/feedback/api-error-message';
import { VentaCancelDialog } from '../components/venta-cancel-dialog/venta-cancel-dialog';
import { VentaCancelRequest, VentaCancelResponse, VentaCancelTarget } from './models/venta-cancel.models';
import { VentaApiService } from './venta-api.service';

@Injectable({ providedIn: 'root' })
export class VentaCancellationService {
    private readonly api = inject(VentaApiService);
    private readonly dialog = inject(MatDialog);
    private readonly feedback = inject(FeedbackService);

    cancel(target: VentaCancelTarget): Observable<VentaCancelResponse | null> {
        return this.api.getRazonesAnulacion().pipe(
            switchMap(razones => this.dialog.open(VentaCancelDialog, {
                width: 'min(520px, calc(100vw - 2rem))',
                data: { codVenta: target.codVenta, rowVersion: target.rowVersion, razones }
            }).afterClosed()),
            switchMap((request: VentaCancelRequest | undefined) =>
                request ? this.api.cancel(target.idVenta, request) : of(null)
            ),
            tap(result => {
                if (result) this.feedback.success(result.mensaje || 'Venta anulada correctamente.');
            }),
            catchError(error => {
                this.feedback.error(getApiErrorMessage(error, 'No se pudo anular la venta.'));
                return of(null);
            })
        );
    }
}