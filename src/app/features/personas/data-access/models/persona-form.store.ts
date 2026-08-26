import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { PersonaApiService } from '../persona-api.service';
import {
    PersonaCreateRequest,
    PersonaCreateResponse,
    PersonaDetail,
    PersonaRolCatalogo,
    PersonaTipoDocumento,
    PersonaUpdateRequest,
    PersonaUpdateResponse
} from './persona-api.models';

export type PersonaSaveResult = PersonaCreateResponse | PersonaUpdateResponse;

@Injectable()
export class PersonaFormStore {
    private readonly api = inject(PersonaApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly tiposDocumentoSignal = signal<readonly PersonaTipoDocumento[]>([]);
    private readonly rolesSignal = signal<readonly PersonaRolCatalogo[]>([]);
    private readonly detailSignal = signal<PersonaDetail | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly loadErrorSignal = signal<string | null>(null);
    private readonly savingSignal = signal(false);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<PersonaSaveResult | null>(null);

    readonly tiposDocumento = this.tiposDocumentoSignal.asReadonly();
    readonly roles = this.rolesSignal.asReadonly();
    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly loadError = this.loadErrorSignal.asReadonly();
    readonly saving = this.savingSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();

    initialize(idPersona: number | null): void {
        this.loadingSignal.set(true);
        this.loadErrorSignal.set(null);
        this.detailSignal.set(null);

        if (idPersona === null) {
            forkJoin({
                tiposDocumento: this.api.getTiposDocumento(),
                roles: this.api.getRoles()
            }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: result => {
                    this.tiposDocumentoSignal.set(result.tiposDocumento);
                    this.rolesSignal.set(result.roles);
                    this.loadingSignal.set(false);
                },
                error: error => {
                    this.loadingSignal.set(false);
                    this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar el formulario de persona.'));
                }
            });
            return;
        }

        forkJoin({
            tiposDocumento: this.api.getTiposDocumento(),
            roles: this.api.getRoles(),
            detail: this.api.getById(idPersona)
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => {
                this.tiposDocumentoSignal.set(result.tiposDocumento);
                this.rolesSignal.set(result.roles);
                this.detailSignal.set(result.detail);
                this.loadingSignal.set(false);
            },
            error: error => {
                this.loadingSignal.set(false);
                this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar la persona.'));
            }
        });
    }

    create(request: PersonaCreateRequest): void {
        this.savingSignal.set(true);
        this.saveErrorSignal.set(null);
        this.saveResultSignal.set(null);
        this.api.create(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => {
                this.savingSignal.set(false);
                this.saveResultSignal.set(result);
            },
            error: error => {
                this.savingSignal.set(false);
                this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar la persona.'));
            }
        });
    }

    update(idPersona: number, request: PersonaUpdateRequest): void {
        this.savingSignal.set(true);
        this.saveErrorSignal.set(null);
        this.saveResultSignal.set(null);
        this.api.update(idPersona, request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => {
                this.savingSignal.set(false);
                this.saveResultSignal.set(result);
            },
            error: error => {
                this.savingSignal.set(false);
                this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo actualizar la persona.'));
            }
        });
    }

    clearSaveResult(): void { this.saveResultSignal.set(null); }
    clearSaveError(): void { this.saveErrorSignal.set(null); }
}
