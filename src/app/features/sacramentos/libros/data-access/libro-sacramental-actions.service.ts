import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { LibroSacramentalDetail } from './models/libro-sacramental.models';
import { LibroSacramentalApiService } from './libro-sacramental-api.service';

@Injectable({ providedIn: 'root' })
export class LibroSacramentalActionsService {
    private readonly api = inject(LibroSacramentalApiService); private readonly dialog = inject(MatDialog); private readonly feedback = inject(FeedbackService);
    changePhysicalStatus(book: LibroSacramentalDetail, target: 'EN_USO' | 'CERRADO'): Observable<boolean> {
        const closing = target === 'CERRADO';
        return this.confirm(closing ? 'Cerrar libro físico' : 'Poner libro en uso', closing ? `¿Confirmas que el Libro ${book.numeroLibro} ya terminó físicamente? Esta acción no podrá revertirse.` : `¿Confirmas que el Libro ${book.numeroLibro} comenzará a utilizarse físicamente?`, closing ? 'Cerrar libro' : 'Poner en uso', closing ? 'lock' : 'menu_book').pipe(
            switchMap(ok => ok ? this.api.changePhysicalStatus(book.idLibroSacramental, target) : of(null)), tap(result => { if (result) this.feedback.success(result.mensaje); }), map(result => result !== null), catchError(error => { this.feedback.error(getApiErrorMessage(error, 'No se pudo cambiar el estado físico del libro.')); return of(false); })
        );
    }
    changeDigitizationStatus(book: LibroSacramentalDetail, target: 'EN_PROCESO' | 'COMPLETADA'): Observable<boolean> {
        const completing = target === 'COMPLETADA';
        return this.confirm(completing ? 'Completar digitalización' : 'Iniciar digitalización', completing ? `¿Confirmas que la transcripción digital del Libro ${book.numeroLibro} ha sido revisada y está completa? Después quedará bloqueada para edición.` : `¿Iniciar la digitalización del Libro ${book.numeroLibro}? Desde este momento ya no podrá cambiarse su estructura de folios.`, completing ? 'Completar' : 'Iniciar', completing ? 'task_alt' : 'play_arrow').pipe(
            switchMap(ok => ok ? this.api.changeDigitizationStatus(book.idLibroSacramental, target) : of(null)), tap(result => { if (result) this.feedback.success(result.mensaje); }), map(result => result !== null), catchError(error => { this.feedback.error(getApiErrorMessage(error, 'No se pudo cambiar el estado de digitalización.')); return of(false); })
        );
    }
    reopenDigitization(book: LibroSacramentalDetail): Observable<boolean> {
        return this.confirm('Reabrir digitalización', `¿Confirmas la reapertura del Libro ${book.numeroLibro}? Se habilitarán nuevamente correcciones autorizadas sobre su información digital.`, 'Reabrir', 'lock_open').pipe(
            switchMap(ok => ok ? this.api.reopenDigitization(book.idLibroSacramental) : of(null)), tap(result => { if (result) this.feedback.success(result.mensaje); }), map(result => result !== null), catchError(error => { this.feedback.error(getApiErrorMessage(error, 'No se pudo reabrir la digitalización.')); return of(false); })
        );
    }
    private confirm(title: string, message: string, confirmText: string, icon: string): Observable<boolean> { return this.dialog.open(ConfirmActionDialog, { width: 'min(520px, calc(100vw - 2rem))', data: { title, message, cancelText: 'Cancelar', confirmText, icon } }).afterClosed(); }
}
