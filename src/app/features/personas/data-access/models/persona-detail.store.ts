import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { PersonaApiService } from '../persona-api.service';
import { PersonaDetail } from './persona-api.models';

@Injectable()
export class PersonaDetailStore {
    private readonly api = inject(PersonaApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly detailSignal = signal<PersonaDetail | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);

    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();

    load(idPersona: number): void {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.api.getById(idPersona).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: detail => {
                this.detailSignal.set(detail);
                this.loadingSignal.set(false);
            },
            error: error => {
                this.loadingSignal.set(false);
                this.errorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la persona.'));
            }
        });
    }
}
