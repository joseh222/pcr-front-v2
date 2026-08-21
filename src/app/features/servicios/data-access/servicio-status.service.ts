import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { ServicioListItem } from './models/servicio-read.models';
import { ServicioChangeStatusResponse } from './models/servicio-write.models';
import { ServicioApiService } from './servicio-api.service';

@Injectable({ providedIn: 'root' })
export class ServicioStatusService {
    private readonly api = inject(ServicioApiService);
    private readonly dialog = inject(MatDialog);
    private readonly feedback = inject(FeedbackService);

    change(servicio: Pick<ServicioListItem, 'idServicio' | 'codigo' | 'nombre' | 'isActive' | 'rowVersion'>): Observable<ServicioChangeStatusResponse | null> {
        const nextActive = !servicio.isActive;
        return this.dialog.open(ConfirmActionDialog, {
            width: 'min(500px, calc(100vw - 2rem))',
            data: {
                title: nextActive ? 'Activar servicio' : 'Desactivar servicio',
                message: nextActive
                    ? `¿Deseas activar ${servicio.codigo} - ${servicio.nombre}? Volverá a estar disponible para nuevas solicitudes.`
                    : `¿Deseas desactivar ${servicio.codigo} - ${servicio.nombre}? Dejará de estar disponible para nuevas solicitudes y módulos que lo utilicen.`,
                cancelText: 'Cancelar',
                confirmText: nextActive ? 'Activar' : 'Desactivar',
                icon: nextActive ? 'check_circle' : 'block'
            }
        }).afterClosed().pipe(
            switchMap(confirmed => confirmed
                ? this.api.changeStatus(servicio.idServicio, { isActive: nextActive, rowVersion: servicio.rowVersion })
                : of(null)
            ),
            tap(result => { if (result) this.feedback.success(result.mensaje); }),
            catchError(error => {
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cambiar el estado del servicio.'));
                return of(null);
            })
        );
    }
}
