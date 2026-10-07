import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { getApiErrorMessage } from '../../../core/feedback/api-error-message';
import { SolicitudServicioCancelDialog } from '../components/solicitud-servicio-cancel-dialog/solicitud-servicio-cancel-dialog';
import { SolicitudServicioListItem } from './models/solicitud-servicio-read.models';
import { SolicitudServicioAnularResponse } from './models/solicitud-servicio-write.models';
import { SolicitudServicioApiService } from './solicitud-servicio-api.service';

@Injectable({ providedIn: 'root' })
export class SolicitudServicioCancellationService {
    private readonly api = inject(SolicitudServicioApiService);
    private readonly dialog = inject(MatDialog);
    private readonly feedback = inject(FeedbackService);

    cancel(target: Pick<SolicitudServicioListItem, 'idSolicitudServicio' | 'codSolicitudServicio' | 'rowVersion'>): Observable<SolicitudServicioAnularResponse | null> {
        return this.dialog.open(SolicitudServicioCancelDialog, {
            width: 'min(520px, calc(100vw - 2rem))',
            data: { codSolicitudServicio: target.codSolicitudServicio, rowVersion: target.rowVersion }
        }).afterClosed().pipe(
            switchMap(request => request ? this.api.cancel(target.idSolicitudServicio, request) : of(null)),
            tap(result => { if (result) this.feedback.success(result.mensaje || 'Solicitud anulada correctamente.'); }),
            catchError(error => {
                this.feedback.error(getApiErrorMessage(error, 'No se pudo anular la solicitud de servicio.'));
                return of(null);
            })
        );
    }
}
