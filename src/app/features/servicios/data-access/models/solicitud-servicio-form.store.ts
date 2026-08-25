import { Injectable, inject, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { PersonaCreateRequest, PersonaCreateResponse, PersonaLookup, PersonaSearchItem, PersonaTipoDocumento } from '../../../personas/data-access/models/persona-api.models';
import { PersonaApiService } from '../../../personas/data-access/persona-api.service';
import { ServicioApiService } from '../servicio-api.service';
import { SolicitudServicioApiService } from '../solicitud-servicio-api.service';
import { ServicioDetail, ServicioLookupItem } from './servicio-lookup.models';
import { SolicitudServicioDetailResponse } from './solicitud-servicio-read.models';
import { SolicitudServicioCreateRequest, SolicitudServicioCreateResponse, SolicitudServicioUpdateRequest, SolicitudServicioUpdateResponse } from './solicitud-servicio-write.models';

export type SolicitudServicioSaveResult = SolicitudServicioCreateResponse | SolicitudServicioUpdateResponse;

@Injectable()
export class SolicitudServicioFormStore {
    private readonly api = inject(SolicitudServicioApiService);
    private readonly servicioApi = inject(ServicioApiService);
    private readonly personaApi = inject(PersonaApiService);

    private readonly detailSignal = signal<SolicitudServicioDetailResponse | null>(null);
    private readonly tiposDocumentoSignal = signal<readonly PersonaTipoDocumento[]>([]);
    private readonly serviceResultsSignal = signal<readonly ServicioLookupItem[]>([]);
    private readonly serviceDetailSignal = signal<ServicioDetail | null>(null);
    private readonly personResultsSignal = signal<readonly PersonaSearchItem[]>([]);
    private readonly documentPersonSignal = signal<PersonaLookup | null>(null);
    private readonly createdPersonSignal = signal<PersonaCreateResponse | null>(null);
    private readonly loadingSignal = signal(false);
    private readonly savingSignal = signal(false);
    private readonly searchingServicesSignal = signal(false);
    private readonly searchingPersonsSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);
    private readonly saveErrorSignal = signal<string | null>(null);
    private readonly personErrorSignal = signal<string | null>(null);
    private readonly saveResultSignal = signal<SolicitudServicioSaveResult | null>(null);

    readonly detail = this.detailSignal.asReadonly();
    readonly tiposDocumento = this.tiposDocumentoSignal.asReadonly();
    readonly serviceResults = this.serviceResultsSignal.asReadonly();
    readonly serviceDetail = this.serviceDetailSignal.asReadonly();
    readonly personResults = this.personResultsSignal.asReadonly();
    readonly documentPerson = this.documentPersonSignal.asReadonly();
    readonly createdPerson = this.createdPersonSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly saving = this.savingSignal.asReadonly();
    readonly searchingServices = this.searchingServicesSignal.asReadonly();
    readonly searchingPersons = this.searchingPersonsSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();
    readonly saveError = this.saveErrorSignal.asReadonly();
    readonly personError = this.personErrorSignal.asReadonly();
    readonly saveResult = this.saveResultSignal.asReadonly();

    initialize(idSolicitudServicio: number | null): void {
        this.loadingSignal.set(true); this.errorSignal.set(null);
        const detail$ = idSolicitudServicio === null ? of(null) : this.api.getById(idSolicitudServicio);
        forkJoin({ tipos: this.personaApi.getTiposDocumento(), detail: detail$ }).subscribe({
            next: result => {
                this.tiposDocumentoSignal.set(result.tipos);
                this.detailSignal.set(result.detail);
                if (result.detail) {
                    this.servicioApi.getById(result.detail.idServicio).subscribe({
                        next: service => { this.serviceDetailSignal.set(service); this.loadingSignal.set(false); },
                        error: error => { this.loadingSignal.set(false); this.errorSignal.set(getApiErrorMessage(error, 'No se pudo cargar el servicio asociado.')); }
                    });
                    return;
                }
                this.loadingSignal.set(false);
            },
            error: error => {
                this.loadingSignal.set(false);
                this.errorSignal.set(getApiErrorMessage(error, 'No se pudo cargar el formulario de solicitud.'));
            }
        });
    }

    searchServices(search: string): void {
        const text = search.trim();
        if (text.length < 2) { this.serviceResultsSignal.set([]); return; }
        this.searchingServicesSignal.set(true);
        this.servicioApi.search(text, 10).pipe(catchError(() => of([] as readonly ServicioLookupItem[]))).subscribe(items => {
            this.serviceResultsSignal.set(items.filter(item => item.codigo.trim().toUpperCase() !== 'MISA'));
            this.searchingServicesSignal.set(false);
        });
    }

    clearServiceSearch(): void { this.serviceResultsSignal.set([]); }

    searchPersons(search: string): void {
        const text = search.trim();
        if (text.length < 2) { this.personResultsSignal.set([]); return; }
        this.searchingPersonsSignal.set(true);
        this.personaApi.search(text, 10).pipe(catchError(() => of([] as readonly PersonaSearchItem[]))).subscribe(items => {
            this.personResultsSignal.set(items);
            this.searchingPersonsSignal.set(false);
        });
    }

    clearPersonSearch(): void { this.personResultsSignal.set([]); }

    findPersonByDocument(idTipoDocumento: number, numeroDocumento: string): void {
        this.personErrorSignal.set(null);
        this.personaApi.getByDocument(idTipoDocumento, numeroDocumento.trim()).subscribe({
            next: person => {
                this.documentPersonSignal.set(person);
                if (!person) this.personErrorSignal.set('No se encontró una persona con ese documento.');
            },
            error: error => this.personErrorSignal.set(getApiErrorMessage(error, 'No se pudo buscar la persona.'))
        });
    }

    clearDocumentPerson(): void { this.documentPersonSignal.set(null); }

    createPerson(request: PersonaCreateRequest): void {
        this.personErrorSignal.set(null);
        this.personaApi.create(request).subscribe({
            next: result => this.createdPersonSignal.set(result),
            error: error => this.personErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar la persona.'))
        });
    }

    clearCreatedPerson(): void { this.createdPersonSignal.set(null); }

    create(request: SolicitudServicioCreateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.create(request).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo registrar la solicitud de servicio.')); }
        });
    }

    update(idSolicitudServicio: number, request: SolicitudServicioUpdateRequest): void {
        this.savingSignal.set(true); this.saveErrorSignal.set(null); this.saveResultSignal.set(null);
        this.api.update(idSolicitudServicio, request).subscribe({
            next: result => { this.savingSignal.set(false); this.saveResultSignal.set(result); },
            error: error => { this.savingSignal.set(false); this.saveErrorSignal.set(getApiErrorMessage(error, 'No se pudo actualizar la solicitud de servicio.')); }
        });
    }

    clearSaveResult(): void { this.saveResultSignal.set(null); }
}
