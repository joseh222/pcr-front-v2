import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { getApiErrorMessage } from '../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { PersonaListItem } from './models/persona-api.models';
import { PersonaApiService } from './persona-api.service';

type PersonaStatusTarget = Pick<PersonaListItem, 'idPersona' | 'codPersona' | 'nombreCompleto' | 'isActive' | 'rowVersion'>;

@Injectable({ providedIn: 'root' })
export class PersonaStatusService {
    private readonly api = inject(PersonaApiService);
    private readonly dialog = inject(MatDialog);
    private readonly feedback = inject(FeedbackService);

    change(persona: PersonaStatusTarget): Observable<boolean> {
        const nextActive = !persona.isActive;
        const label = persona.nombreCompleto?.trim() || persona.codPersona?.trim() || `Persona #${persona.idPersona}`;

        return this.dialog.open(ConfirmActionDialog, {
            width: 'min(500px, calc(100vw - 2rem))',
            data: {
                title: nextActive ? 'Activar persona' : 'Desactivar persona',
                message: nextActive
                    ? `¿Deseas activar a ${label}? Volverá a estar disponible para nuevas selecciones en los procesos de la parroquia.`
                    : `¿Deseas desactivar a ${label}? Sus registros históricos se conservarán, pero dejará de estar disponible para nuevas selecciones.`,
                cancelText: 'Cancelar',
                confirmText: nextActive ? 'Activar' : 'Desactivar',
                icon: nextActive ? 'check_circle' : 'block'
            }
        }).afterClosed().pipe(
            switchMap(confirmed => confirmed
                ? this.api.changeStatus(persona.idPersona, { isActive: nextActive, rowVersion: persona.rowVersion })
                : of(null)
            ),
            tap(result => { if (result) this.feedback.success(result.mensaje); }),
            switchMap(result => of(result !== null)),
            catchError(error => {
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cambiar el estado de la persona.'));
                return of(false);
            })
        );
    }
}
