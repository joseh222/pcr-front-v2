import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { CompraCancelDialog } from '../components/compra-cancel-dialog/compra-cancel-dialog';
import { CompraCancelResponse, CompraCancelTarget } from './models/compra-cancel.models';
import { CompraApiService } from './compra-api.service';

@Injectable({ providedIn: 'root' })
export class CompraCancellationService {
    private readonly api = inject(CompraApiService);
    private readonly dialog = inject(MatDialog);
    private readonly feedback = inject(FeedbackService);

    cancel(target: CompraCancelTarget): Observable<CompraCancelResponse | null> {
        return this.dialog.open(CompraCancelDialog, {
            width: 'min(520px, calc(100vw - 2rem))',
            data: { codCompra: target.codCompra, rowVersion: target.rowVersion }
        }).afterClosed().pipe(
            switchMap(request => request ? this.api.cancel(target.idCompra, request) : of(null)),
            tap(result => { if (result) this.feedback.success(result.mensaje || 'Compra anulada correctamente.'); }),
            catchError(error => { this.feedback.error(getApiErrorMessage(error, 'No se pudo anular la compra.')); return of(null); })
        );
    }
}
