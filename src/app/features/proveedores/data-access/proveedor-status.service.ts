import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { ProveedorListItem } from './models/proveedor-read.models';
import { ProveedorChangeStatusResponse } from './models/proveedor-write.models';
import { ProveedorApiService } from './proveedor-api.service';

@Injectable({ providedIn: 'root' })
export class ProveedorStatusService {
    private readonly api = inject(ProveedorApiService);
    private readonly dialog = inject(MatDialog);
    private readonly feedback = inject(FeedbackService);

    change(proveedor: Pick<ProveedorListItem, 'idProveedor' | 'codProveedor' | 'razonSocial' | 'isActive' | 'rowVersion'>): Observable<ProveedorChangeStatusResponse | null> {
        const nextActive = !proveedor.isActive;
        return this.dialog.open(ConfirmActionDialog, {
            width: 'min(500px, calc(100vw - 2rem))',
            data: {
                title: nextActive ? 'Activar proveedor' : 'Desactivar proveedor',
                message: nextActive
                    ? `¿Deseas activar ${proveedor.codProveedor} - ${proveedor.razonSocial}? Volverá a estar disponible para nuevas compras.`
                    : `¿Deseas desactivar ${proveedor.codProveedor} - ${proveedor.razonSocial}? Dejará de estar disponible para nuevas compras.`,
                cancelText: 'Cancelar',
                confirmText: nextActive ? 'Activar' : 'Desactivar',
                icon: nextActive ? 'check_circle' : 'block'
            }
        }).afterClosed().pipe(
            switchMap(confirmed => confirmed
                ? this.api.changeStatus(proveedor.idProveedor, { isActive: nextActive, rowVersion: proveedor.rowVersion })
                : of(null)
            ),
            tap(result => { if (result) this.feedback.success(result.mensaje); }),
            catchError(error => {
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cambiar el estado del proveedor.'));
                return of(null);
            })
        );
    }
}
