import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { TemporaryPasswordDialog } from '../components/temporary-password-dialog/temporary-password-dialog';
import { UsuarioListItem } from './models/usuario-api.models';
import { UsuarioApiService } from './usuario-api.service';

type UsuarioActionTarget = Pick<UsuarioListItem, 'idUser' | 'username' | 'nombreCompleto' | 'isActive'>;

@Injectable({ providedIn: 'root' })
export class UsuarioActionsService {
    private readonly api = inject(UsuarioApiService); private readonly dialog = inject(MatDialog); private readonly feedback = inject(FeedbackService);

    changeStatus(user: UsuarioActionTarget): Observable<boolean> {
        const nextActive = !user.isActive; const label = this.label(user);
        return this.confirm(nextActive ? 'Activar usuario' : 'Desactivar usuario', nextActive ? `¿Deseas activar a ${label}? Podrá volver a iniciar sesión.` : `¿Deseas desactivar a ${label}? Sus sesiones activas serán revocadas.`, nextActive ? 'Activar' : 'Desactivar', nextActive ? 'check_circle' : 'block').pipe(
            switchMap(confirmed => confirmed ? this.api.getById(user.idUser).pipe(switchMap(detail => this.api.changeStatus(user.idUser, nextActive, detail.rowVersion))) : of(null)),
            tap(result => { if (result) this.feedback.success(result.mensaje); }), map(result => result !== null),
            catchError(error => { this.feedback.error(getApiErrorMessage(error, 'No se pudo cambiar el estado del usuario.')); return of(false); })
        );
    }

    resetPassword(user: UsuarioActionTarget): Observable<boolean> {
        const label = this.label(user);
        return this.confirm('Restablecer contraseña', `¿Deseas generar una nueva contraseña temporal para ${label}? Sus sesiones activas serán revocadas.`, 'Restablecer', 'key').pipe(
            switchMap(confirmed => confirmed ? this.api.resetPassword(user.idUser) : of(null)),
            tap(result => { if (result) this.dialog.open(TemporaryPasswordDialog, { width: 'min(520px, calc(100vw - 2rem))', data: { title: 'Contraseña restablecida', username: result.username, temporaryPassword: result.temporaryPassword, message: result.mensaje } }); }),
            map(result => result !== null), catchError(error => { this.feedback.error(getApiErrorMessage(error, 'No se pudo restablecer la contraseña.')); return of(false); })
        );
    }

    revokeSession(user: UsuarioActionTarget): Observable<boolean> {
        const label = this.label(user);
        return this.confirm('Revocar sesiones', `¿Deseas cerrar todas las sesiones activas de ${label}?`, 'Revocar', 'logout').pipe(
            switchMap(confirmed => confirmed ? this.api.revokeSession(user.idUser) : of(null)),
            tap(result => { if (result) this.feedback.success(result.mensaje); }), map(result => result !== null),
            catchError(error => { this.feedback.error(getApiErrorMessage(error, 'No se pudieron revocar las sesiones.')); return of(false); })
        );
    }

    private confirm(title: string, message: string, confirmText: string, icon: string): Observable<boolean> {
        return this.dialog.open(ConfirmActionDialog, { width: 'min(500px, calc(100vw - 2rem))', data: { title, message, cancelText: 'Cancelar', confirmText, icon } }).afterClosed();
    }
    private label(user: UsuarioActionTarget): string { return user.nombreCompleto?.trim() || user.username; }
}
