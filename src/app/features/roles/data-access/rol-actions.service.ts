import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { RolListItem } from './models/rol-api.models';
import { RolApiService } from './rol-api.service';

@Injectable({ providedIn: 'root' })
export class RolActionsService {
    private readonly api = inject(RolApiService); private readonly dialog = inject(MatDialog); private readonly feedback = inject(FeedbackService);
    changeStatus(role: RolListItem): Observable<boolean> {
        if (role.isSystem) return of(false); const nextActive = !role.isActive;
        return this.dialog.open(ConfirmActionDialog, { width: 'min(500px, calc(100vw - 2rem))', data: { title: nextActive ? 'Activar rol' : 'Desactivar rol', message: nextActive ? `¿Deseas activar el rol ${role.name}?` : `¿Deseas desactivar el rol ${role.name}? Los usuarios que dependan únicamente de este rol podrían impedir la operación.`, cancelText: 'Cancelar', confirmText: nextActive ? 'Activar' : 'Desactivar', icon: nextActive ? 'check_circle' : 'block' } }).afterClosed().pipe(
            switchMap(confirmed => confirmed ? this.api.getById(role.idRole).pipe(switchMap(detail => this.api.changeStatus(role.idRole, nextActive, detail.rowVersion))) : of(null)),
            tap(result => { if (result) this.feedback.success(result.mensaje); }), map(result => result !== null), catchError(error => { this.feedback.error(getApiErrorMessage(error, 'No se pudo cambiar el estado del rol.')); return of(false); })
        );
    }
}
