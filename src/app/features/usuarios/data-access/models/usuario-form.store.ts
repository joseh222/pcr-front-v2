import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { UsuarioApiService } from '../usuario-api.service';
import {
    UsuarioCreateRequest, UsuarioCreateResponse, UsuarioDetail, UsuarioRole, UsuarioUpdateRequest, UsuarioUpdateResponse
} from './usuario-api.models';

export type UsuarioSaveResult = UsuarioCreateResponse | UsuarioUpdateResponse;

@Injectable()
export class UsuarioFormStore {
    private readonly api = inject(UsuarioApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly rolesSignal = signal<readonly UsuarioRole[]>([]);
    private readonly detailSignal = signal<UsuarioDetail | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly loadErrorSignal = signal<string | null>(null);
    private readonly savingSignal = signal(false);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<UsuarioSaveResult | null>(null);

    readonly roles = this.rolesSignal.asReadonly();
    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly loadError = this.loadErrorSignal.asReadonly();
    readonly saving = this.savingSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();

    initialize(idUser: number | null): void {
        this.loadingSignal.set(true); this.loadErrorSignal.set(null); this.detailSignal.set(null);
        if (idUser === null) {
            this.api.getRoles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                next: roles => { this.rolesSignal.set(roles); this.loadingSignal.set(false); },
                error: error => { this.loadingSignal.set(false); this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar el formulario de usuario.')); }
            });
            return;
        }

        forkJoin({ roles: this.api.getRoles(), detail: this.api.getById(idUser) }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => {
                const merged = [...result.roles];
                result.detail.roles.filter(role => !merged.some(item => item.idRole === role.idRole)).forEach(role => merged.push(role));
                this.rolesSignal.set(merged); this.detailSignal.set(result.detail); this.loadingSignal.set(false);
            },
            error: error => { this.loadingSignal.set(false); this.loadErrorSignal.set(getApiErrorMessage(error, 'No se pudo cargar el usuario.')); }
        });
    }

    create(request: UsuarioCreateRequest): void { this.save(this.api.create(request), 'No se pudo crear el usuario.'); }
    update(idUser: number, request: UsuarioUpdateRequest): void { this.save(this.api.update(idUser, request), 'No se pudo actualizar el usuario.'); }
    clearSaveResult(): void { this.saveResultSignal.set(null); }
    clearSaveError(): void { this.saveErrorSignal.set(null); }

    private save<T extends UsuarioSaveResult>(request: Observable<T>, fallback: string): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, fallback)); }
        });
    }
}
