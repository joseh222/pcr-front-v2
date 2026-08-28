import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';

import { MisaApiService } from '../misa-api.service';
import { MisaModalidad, MisaSanto, MisaTipo } from './misa-catalog.models';
import { MisaDetail } from './misa-read.models';
import { PersonaLookup, PersonaSearchItem, PersonaTipoDocumento } from '../../../personas/data-access/models/persona-api.models';
import { MisaCreateRequest, MisaUpdateRequest, MisaWriteResponse } from './misa-write.models';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';

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

    private readonly personSearchResultsSignal = signal<readonly PersonaSearchItem[]>([]);
    private readonly personSearchLoadingSignal = signal(false);
    private readonly personSearchErrorSignal = signal<string | null>(null);
    private personSearchVersion = 0;

    readonly personSearchResults = this.personSearchResultsSignal.asReadonly();
    readonly personSearchLoading = this.personSearchLoadingSignal.asReadonly();
    readonly personSearchError = this.personSearchErrorSignal.asReadonly();

    private readonly santosSignal = signal<readonly MisaSanto[]>([]);
    readonly santos = this.santosSignal.asReadonly();

    private readonly savingSignal = signal(false);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<MisaWriteResponse | null>(null);

    readonly saving = this.savingSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();

    initialize(idMisa: number | null): void {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        forkJoin({
            modalidades: this.api.getModalidades(),
            tipos: this.api.getTipos(),
            santos: this.api.getSantos(),
            tiposDocumento: this.api.getPersonaTiposDocumento(),
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
                    this.santosSignal.set(result.santos);
                },
                error: error => {
                    this.loadingSignal.set(false);
                    this.errorSignal.set(this.getErrorMessage(error, 'No se pudo cargar la información de la misa.'));
                }
            });
    }

    private getErrorMessage(error: unknown, fallback = 'No se pudo cargar la información de la misa.'): string {
        return getApiErrorMessage(error, fallback);
    }

    findPersonByDocument(idTipoDocumento: number, numeroDocumento: string): void {
        const documento = numeroDocumento.trim();
        const version = ++this.documentLookupVersion;

        this.documentLookupLoadingSignal.set(true);
        this.documentLookupStateSignal.set('idle');
        this.documentLookupErrorSignal.set(null);

        this.api.getPersonaByDocument(idTipoDocumento, documento)
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
                    this.documentLookupErrorSignal.set(this.getErrorMessage(error, 'No se pudo consultar la persona.'));
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

    searchPersons(search: string): void {
        const term = search.trim();

        if (term.length < 3) {
            this.clearPersonSearch();
            return;
        }

        const version = ++this.personSearchVersion;
        this.personSearchLoadingSignal.set(true);
        this.personSearchErrorSignal.set(null);

        this.api.searchPersonas(term, 10)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    if (version !== this.personSearchVersion) return;
                    this.personSearchResultsSignal.set(result);
                    this.personSearchLoadingSignal.set(false);
                },
                error: error => {
                    if (version !== this.personSearchVersion) return;
                    this.personSearchResultsSignal.set([]);
                    this.personSearchLoadingSignal.set(false);
                    this.personSearchErrorSignal.set(this.getErrorMessage(this.getErrorMessage(error, 'No se pudo buscar personas.')));
                }
            });
    }

    clearPersonSearch(): void {
        this.personSearchVersion++;
        this.personSearchResultsSignal.set([]);
        this.personSearchLoadingSignal.set(false);
        this.personSearchErrorSignal.set(null);
    }

    create(request: MisaCreateRequest): void {
        this.savingSignal.set(true);
        this.saveErrorSignal.set(null);
        this.saveResultSignal.set(null);

        this.api.create(request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.savingSignal.set(false);
                    this.saveResultSignal.set(result);
                },
                error: error => {
                    this.savingSignal.set(false);
                    this.saveErrorSignal.set(this.getErrorMessage(error, 'No se pudo registrar la misa.'));
                }
            });
    }

    update(idMisa: number, request: MisaUpdateRequest): void {
        this.savingSignal.set(true);
        this.saveErrorSignal.set(null);
        this.saveResultSignal.set(null);

        this.api.update(idMisa, request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: result => {
                    this.savingSignal.set(false);
                    this.saveResultSignal.set(result);
                },
                error: error => {
                    this.savingSignal.set(false);
                    this.saveErrorSignal.set(this.getErrorMessage(error, 'No se pudo actualizar la misa.'));
                }
            });
    }

    clearSaveResult(): void {
        this.saveResultSignal.set(null);
        this.saveErrorSignal.set(null);
    }
}