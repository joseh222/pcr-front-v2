import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';

import { MisaApiService } from '../misa-api.service';
import { MisaModalidad, MisaTipo } from './misa-catalog.models';
import { MisaDetail } from './misa-read.models';

@Injectable()
export class MisaFormStore {
    private readonly api = inject(MisaApiService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly modalidadesSignal = signal<readonly MisaModalidad[]>([]);
    private readonly tiposSignal = signal<readonly MisaTipo[]>([]);
    private readonly detailSignal = signal<MisaDetail | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);

    readonly modalidades = this.modalidadesSignal.asReadonly();
    readonly tipos = this.tiposSignal.asReadonly();
    readonly detail = this.detailSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();

    initialize(idMisa: number | null): void {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        forkJoin({
            modalidades: this.api.getModalidades(),
            tipos: this.api.getTipos(),
            detail: idMisa === null ? of(null) : this.api.getById(idMisa)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.modalidadesSignal.set(result.modalidades);
                    this.tiposSignal.set(result.tipos);
                    this.detailSignal.set(result.detail);
                    this.loadingSignal.set(false);
                },
                error: error => {
                    this.loadingSignal.set(false);
                    this.errorSignal.set(this.getErrorMessage(error));
                }
            });
    }

    private getErrorMessage(error: unknown): string {
        if (error instanceof HttpErrorResponse) {
            const detail = error.error?.detail;
            const message = error.error?.message;
            if (typeof detail === 'string' && detail.trim()) return detail.trim();
            if (typeof message === 'string' && message.trim()) return message.trim();
        }

        return 'No se pudo cargar la información de la misa.';
    }
}