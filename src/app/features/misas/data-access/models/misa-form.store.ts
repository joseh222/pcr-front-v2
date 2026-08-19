import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';

import { MisaApiService } from '../misa-api.service';
import { MisaModalidad, MisaTipo } from './misa-catalog.models';
import { MisaDetail } from './misa-read.models';
import { PersonaApiService } from '../../../personas/data-access/persona-api.service';
import { PersonaLookup, PersonaTipoDocumento } from '../../../personas/data-access/models/persona-api.models';

@Injectable()
export class MisaFormStore {
    private readonly api = inject(MisaApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly personaApi = inject(PersonaApiService);

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

    private readonly tiposDocumentoSignal = signal<readonly PersonaTipoDocumento[]>([]);
    private readonly documentPersonSignal = signal<PersonaLookup | null>(null);
    private readonly documentLookupLoadingSignal = signal(false);
    private readonly documentLookupStateSignal = signal<'idle' | 'found' | 'not-found' | 'error'>('idle');
    private readonly documentLookupErrorSignal = signal<string | null>(null);
    private documentLookupVersion = 0;

    readonly tiposDocumento = this.tiposDocumentoSignal.asReadonly();
    readonly documentPerson = this.documentPersonSignal.asReadonly();
    readonly documentLookupLoading = this.documentLookupLoadingSignal.asReadonly();
    readonly documentLookupState = this.documentLookupStateSignal.asReadonly();
    readonly documentLookupError = this.documentLookupErrorSignal.asReadonly();

    initialize(idMisa: number | null): void {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        forkJoin({
            modalidades: this.api.getModalidades(),
            tipos: this.api.getTipos(),
            tiposDocumento: this.personaApi.getTiposDocumento(),
            detail: idMisa === null ? of(null) : this.api.getById(idMisa)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.tiposDocumentoSignal.set(result.tiposDocumento);
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

    findPersonByDocument(idTipoDocumento: number, numeroDocumento: string): void {
        const documento = numeroDocumento.trim();
        const version = ++this.documentLookupVersion;

        this.documentLookupLoadingSignal.set(true);
        this.documentLookupStateSignal.set('idle');
        this.documentLookupErrorSignal.set(null);

        this.personaApi.getByDocument(idTipoDocumento, documento)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: person => {
                    if (version !== this.documentLookupVersion) return;
                    this.documentLookupLoadingSignal.set(false);
                    this.documentPersonSignal.set(person);
                    this.documentLookupStateSignal.set(person ? 'found' : 'not-found');
                },
                error: error => {
                    if (version !== this.documentLookupVersion) return;
                    this.documentLookupLoadingSignal.set(false);
                    this.documentPersonSignal.set(null);
                    this.documentLookupStateSignal.set('error');
                    this.documentLookupErrorSignal.set(this.getErrorMessage(error));
                }
            });
    }

    clearDocumentPerson(): void {
        this.documentLookupVersion++;
        this.documentPersonSignal.set(null);
        this.documentLookupLoadingSignal.set(false);
        this.documentLookupStateSignal.set('idle');
        this.documentLookupErrorSignal.set(null);
    }
}