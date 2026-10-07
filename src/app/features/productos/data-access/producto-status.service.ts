import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { ProductoListItem } from './models/producto-read.models';
import { ProductoChangeStatusResponse } from './models/producto-write.models';
import { ProductoApiService } from './producto-api.service';

@Injectable({ providedIn: 'root' })
export class ProductoStatusService {
    private readonly api = inject(ProductoApiService);
    private readonly dialog = inject(MatDialog);
    private readonly feedback = inject(FeedbackService);

    change(producto: Pick<ProductoListItem, 'idProducto' | 'codProducto' | 'nombre' | 'isActive' | 'rowVersion'>): Observable<ProductoChangeStatusResponse | null> {
        const nextActive = !producto.isActive;
        return this.dialog.open(ConfirmActionDialog, {
            width: 'min(500px, calc(100vw - 2rem))',
            data: {
                title: nextActive ? 'Activar producto' : 'Desactivar producto',
                message: nextActive
                    ? `¿Deseas activar ${producto.codProducto} - ${producto.nombre}? Volverá a estar disponible para las operaciones comerciales.`
                    : `¿Deseas desactivar ${producto.codProducto} - ${producto.nombre}? Dejará de aparecer en las nuevas ventas.`,
                cancelText: 'Cancelar',
                confirmText: nextActive ? 'Activar' : 'Desactivar',
                icon: nextActive ? 'check_circle' : 'block'
            }
        }).afterClosed().pipe(
            switchMap(confirmed => confirmed
                ? this.api.changeStatus(producto.idProducto, { isActive: nextActive, rowVersion: producto.rowVersion })
                : of(null)
            ),
            tap(result => { if (result) this.feedback.success(result.mensaje); }),
            catchError(error => {
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cambiar el estado del producto.'));
                return of(null);
            })
        );
    }
}
