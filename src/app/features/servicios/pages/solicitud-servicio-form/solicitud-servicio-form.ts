import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { PersonaSearchItem } from '../../../personas/data-access/models/persona-api.models';
import { SolicitudServicioFormStore } from '../../data-access/models/solicitud-servicio-form.store';
import { SolicitudServicioApiService } from '../../data-access/solicitud-servicio-api.service';
import { RegistroSacramentalSearchItem } from '../../data-access/models/solicitud-servicio-read.models';
import { RegistroSacramentalSelectorDialog } from '../../components/registro-sacramental-selector-dialog/registro-sacramental-selector-dialog';
import { ServicioLookupItem } from '../../data-access/models/servicio-lookup.models';
import { canEditSolicitud, isMisaSolicitud } from '../../data-access/models/solicitud-servicio.rules';
import { SolicitudServicioCreateRequest, SolicitudServicioUpdateRequest } from '../../data-access/models/solicitud-servicio-write.models';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';

interface SelectedPerson {
    readonly idPersona: number;
    readonly nombreCompleto: string | null;
    readonly numeroDocumento: string | null;
    readonly telefono: string | null;
}

@Component({
    selector: 'pcr-solicitud-servicio-form',
    imports: [ReactiveFormsModule, RouterLink, MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    providers: [SolicitudServicioFormStore],
    templateUrl: './solicitud-servicio-form.html',
    styleUrl: './solicitud-servicio-form.scss'
})
export class SolicitudServicioFormPage implements OnInit {
    protected readonly store = inject(SolicitudServicioFormStore);
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly feedback = inject(FeedbackService);
    private readonly dialog = inject(MatDialog);
    private readonly api = inject(SolicitudServicioApiService);
    private readonly authStore = inject(AuthStore);
    protected readonly canCreatePerson = () => this.authStore.hasPermission(PERMISSION_CODE.SERVICE_REQUEST_CREATE);

    protected readonly idSolicitudServicio = signal<number | null>(null);
    protected readonly selectedService = signal<ServicioLookupItem | null>(null);
    protected readonly selectedPerson = signal<SelectedPerson | null>(null);
    protected readonly showNewPerson = signal(false);
    protected readonly selectedRegistro = signal<RegistroSacramentalSearchItem | null>(null);
    private readonly registroChanged = signal(false);
    private originalRequiresPayment = false;

    protected readonly isEditMode = computed(() => this.idSolicitudServicio() !== null);
    protected readonly pageTitle = computed(() => this.isEditMode() ? 'Editar solicitud' : 'Nueva solicitud');

    protected readonly form = this.fb.group({
        idServicio: this.fb.control<number | null>(null, Validators.required),
        serviceSearch: this.fb.nonNullable.control(''),
        idPersona: this.fb.control<number | null>(null),
        personaSearch: this.fb.nonNullable.control(''),
        requierePago: this.fb.nonNullable.control(true),
        cantidad:this.fb.nonNullable.control(1,[Validators.required,Validators.min(1),Validators.pattern(/^\d+$/)]),
        importe: this.fb.control<number | null>(null),
        motivoNoPago: this.fb.nonNullable.control('', Validators.maxLength(250)),
        observaciones: this.fb.nonNullable.control('', Validators.maxLength(500))
    });

    protected readonly personForm = this.fb.group({
        idTipoDocumento: this.fb.control<number | null>(null),
        numeroDocumento: this.fb.nonNullable.control('', Validators.maxLength(20)),
        nombreCompleto: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(250)]),
        telefono: this.fb.nonNullable.control('', Validators.maxLength(20))
    });

    private readonly syncDetail = effect(() => {
        const detail = this.store.detail();
        if (!detail) return;
        if (isMisaSolicitud(detail) || !canEditSolicitud(detail)) {
            this.feedback.info(isMisaSolicitud(detail) ? 'Las solicitudes de Misa se administran desde el módulo Misas.' : 'Esta solicitud ya no puede modificarse.');
            void this.router.navigate(['/servicios', detail.idSolicitudServicio]);
            return;
        }
        this.originalRequiresPayment = detail.requierePago;
        this.form.patchValue({
            idServicio: detail.idServicio,
            idPersona: detail.idPersona,
            requierePago: detail.requierePago,
            cantidad:detail.cantidad,
            importe: detail.importe,
            motivoNoPago: detail.motivoNoPago ?? '',
            observaciones: detail.observaciones ?? ''
        }, { emitEvent: false });
        this.selectedPerson.set(detail.idPersona ? { idPersona: detail.idPersona, nombreCompleto: detail.nombreCompleto, numeroDocumento: detail.numeroDocumento, telefono: detail.telefono } : null);
        if(detail.tieneRegistroSacramental && detail.idRegistroSacramental && detail.codigoTipoSacramentoRegistro){ this.selectedRegistro.set({codigoTipoSacramento:detail.codigoTipoSacramentoRegistro,idRegistroSacramental:detail.idRegistroSacramental,nombrePrincipal:detail.nombreRegistroSacramental??'',nombreSecundario:null,dniPrincipal:null,dniSecundario:null,fechaNacimientoPrincipal:null,fechaSacramento:detail.fechaSacramentoRegistro,padresResumen:null,idLibroSacramental:detail.idLibroSacramentalRegistro??0,numeroLibro:detail.numeroLibroRegistro??'',idFolioSacramental:detail.idFolioSacramentalRegistro??0,numeroFolio:detail.numeroFolioRegistro??'',numeroPartida:detail.numeroPartidaRegistro??''}); }
    });

    private readonly syncService = effect(() => {
        const service = this.store.serviceDetail();
        if (!service) return;
        this.selectedService.set(service);
        this.applyCommercialRules(true);
    });

    private readonly syncCreatedPerson = effect(() => {
        const result = this.store.createdPerson();
        if (!result) return;
        const value = this.personForm.getRawValue();
        this.selectedPerson.set({ idPersona: result.idPersona, nombreCompleto: value.nombreCompleto.trim(), numeroDocumento: this.nullableText(value.numeroDocumento), telefono: this.nullableText(value.telefono) });
        this.form.controls.idPersona.setValue(result.idPersona, { emitEvent: false });
        this.showNewPerson.set(false);
        this.feedback.success(result.mensaje || 'Persona registrada correctamente.');
        this.store.clearCreatedPerson();
    });

    private readonly syncErrors = effect(() => {
        const message = this.store.error() || this.store.saveError() || this.store.personError();
        if (message) this.feedback.error(message);
    });

    private readonly syncSaveResult = effect(() => {
        const result=this.store.saveResult(); if(!result)return; const editing=this.isEditMode(); this.store.clearSaveResult();
        const service=this.selectedService();
        if(service?.requiereRegistroSacramental && this.selectedRegistro() && (!editing || this.registroChanged())) {
            const registro=this.selectedRegistro()!;
            const rowVersion=editing ? (this.store.detail()?.registroSacramentalRowVersion ?? null) : null;
            this.api.setRegistroSacramental(result.idSolicitudServicio,{codigoTipoSacramento:service.codigoTipoSacramentoRequerido!,idRegistroSacramental:registro.idRegistroSacramental,rowVersion}).subscribe({
                next:()=>this.finishSave(result,editing,true),
                error:e=>{this.feedback.error('La solicitud se guardó, pero no se pudo asociar el registro sacramental. Puedes completar la asociación desde Editar.');void this.router.navigate(['/servicios',result.idSolicitudServicio]);}
            });
            return;
        }
        this.finishSave(result,editing,!!this.selectedRegistro() || !service?.requiereRegistroSacramental);
    });

    private finishSave(result:any,editing:boolean,readyForSale:boolean):void {
        this.feedback.success(result.mensaje || (editing?'Solicitud actualizada correctamente.':'Solicitud registrada correctamente.'));
        if(this.selectedService()?.requiereRegistroSacramental && !readyForSale){this.feedback.info('La solicitud quedó pendiente de asociar a una partida sacramental antes del cobro.');void this.router.navigate(['/servicios',result.idSolicitudServicio]);return;}
        const shouldOfferSale=!editing || (!!this.selectedService()?.requiereRegistroSacramental && this.registroChanged());
        if(!shouldOfferSale){void this.router.navigate(['/servicios',result.idSolicitudServicio]);return;}
        if(result.requierePago && result.estadoPago==='PENDIENTE' && this.authStore.hasPermission(PERMISSION_CODE.SALE_CREATE)){
            this.dialog.open(ConfirmActionDialog,{width:'min(460px, calc(100vw - 2rem))',data:{title:'Solicitud registrada',message:`La solicitud ${result.codSolicitudServicio} está lista para cobrar. ¿Deseas registrar la venta ahora?`,cancelText:'Más tarde',confirmText:'Cobrar ahora',icon:'payments'}}).afterClosed().subscribe(confirm=>{if(confirm){void this.router.navigate(['/ventas/nueva'],{queryParams:{solicitudServicioId:result.idSolicitudServicio,origen:'servicio'}});return;}void this.router.navigate(['/servicios',result.idSolicitudServicio]);});return;
        }
        void this.router.navigate(['/servicios',result.idSolicitudServicio]);
    }

    ngOnInit(): void {
        this.setupSearches();
        this.form.controls.requierePago.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.applyCommercialRules(false));
        const rawId = this.route.snapshot.paramMap.get('id');
        if (rawId === null) { this.store.initialize(null); return; }
        const id = Number(rawId);
        if (!Number.isInteger(id) || id <= 0) { void this.router.navigate(['/servicios']); return; }
        this.idSolicitudServicio.set(id); this.store.initialize(id);
    }

    protected selectService(service: ServicioLookupItem): void {
        this.selectedService.set(service); this.selectedRegistro.set(null); this.registroChanged.set(false);
        this.form.patchValue({ idServicio: service.idServicio, serviceSearch: '' }, { emitEvent: false });
        this.store.clearServiceSearch();
        this.applyCommercialRules(false);
    }

    protected clearService(): void {
        if (this.isEditMode()) return;
        this.selectedService.set(null);
        this.selectedRegistro.set(null); this.registroChanged.set(false);
        this.form.patchValue({ idServicio: null, serviceSearch: '', importe: null }, { emitEvent: false });
        this.store.clearServiceSearch();
    }

    protected selectPerson(person: PersonaSearchItem): void {
        this.selectedPerson.set({ idPersona: person.idPersona, nombreCompleto: person.nombreCompleto, numeroDocumento: person.numeroDocumento, telefono: person.telefono });
        this.form.patchValue({ idPersona: person.idPersona, personaSearch: '' }, { emitEvent: false });
        this.store.clearPersonSearch();
    }

    protected clearPerson(): void {
        this.selectedPerson.set(null);
        this.form.patchValue({ idPersona: null, personaSearch: '' }, { emitEvent: false });
        this.store.clearPersonSearch();
    }

    protected toggleNewPerson(): void {
        if (!this.canCreatePerson()) return;
        this.showNewPerson.update(value => !value);
        if (!this.showNewPerson()) this.personForm.reset({ idTipoDocumento: null, numeroDocumento: '', nombreCompleto: '', telefono: '' });
    }

    protected registerPerson(): void {
        if (!this.canCreatePerson()) return;
        this.personForm.markAllAsTouched();
        if (this.personForm.invalid) return;
        const value = this.personForm.getRawValue();
        this.store.createPerson({ idTipoDocumento: value.idTipoDocumento, numeroDocumento: this.nullableText(value.numeroDocumento), nombreCompleto: value.nombreCompleto.trim(), fechaNacimiento: null, telefono: this.nullableText(value.telefono), email: null, direccion: null, roles: [] });
    }

    protected selectRegistro():void {
        const service=this.selectedService(); if(!service?.requiereRegistroSacramental || !service.codigoTipoSacramentoRequerido)return;
        this.dialog.open(RegistroSacramentalSelectorDialog,{width:'min(980px, calc(100vw - 2rem))',maxWidth:'98vw',data:{codigoTipoSacramento:service.codigoTipoSacramentoRequerido,nombreTipoSacramento:service.nombreTipoSacramentoRequerido??service.codigoTipoSacramentoRequerido}}).afterClosed().subscribe((item:RegistroSacramentalSearchItem|undefined)=>{if(!item)return;this.selectedRegistro.set(item);this.registroChanged.set(true);});
    }
    protected canClearRegistro():boolean { return !this.store.detail()?.tieneRegistroSacramental; }
    protected clearRegistro():void { if(!this.canClearRegistro())return; this.selectedRegistro.set(null);this.registroChanged.set(true); }

    protected servicePriceLabel(): string {
        const service = this.selectedService();
        if (!service) return '';
        if (service.modoPrecio === 'VARIABLE') return 'El importe se define en esta solicitud.';
        return service.precioBase === null ? 'Sin precio configurado' : `Precio base S/ ${service.precioBase.toFixed(2)}`;
    }

    protected save(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid || this.store.saving()) return;
        const id = this.idSolicitudServicio();
        if (id === null) { this.store.create(this.buildCreateRequest()); return; }
        const detail = this.store.detail();
        if (!detail) return;
        this.store.update(id, this.buildUpdateRequest(detail.rowVersion));
    }

    private buildCreateRequest(): SolicitudServicioCreateRequest {
        const value = this.form.getRawValue();
        return { idServicio: value.idServicio!, idPersona: value.idPersona, requierePago: value.requierePago, cantidad:value.cantidad, importe: this.requestAmount(), motivoNoPago: value.requierePago ? null : this.nullableText(value.motivoNoPago), observaciones: this.nullableText(value.observaciones) };
    }

    private buildUpdateRequest(rowVersion: string): SolicitudServicioUpdateRequest {
        const value = this.form.getRawValue();
        return { idPersona: value.idPersona, requierePago: value.requierePago, cantidad:value.cantidad, importe: this.requestAmount(), motivoNoPago: value.requierePago ? null : this.nullableText(value.motivoNoPago), observaciones: this.nullableText(value.observaciones), rowVersion };
    }

    private requestAmount(): number | null {
        if (!this.form.controls.requierePago.value) return null;
        return this.selectedService()?.modoPrecio === 'VARIABLE' ? this.form.controls.importe.value : null;
    }

    private applyCommercialRules(initialDetail: boolean): void {
        const service = this.selectedService();
        const requiresPayment = this.form.controls.requierePago.value;
        const amount = this.form.controls.importe;
        const reason = this.form.controls.motivoNoPago;
        if (!requiresPayment) {
            amount.clearValidators(); amount.disable({ emitEvent: false }); amount.setValue(null, { emitEvent: false });
            reason.setValidators([Validators.required, Validators.maxLength(250)]);
        } else {
            reason.setValue('', { emitEvent: false }); reason.setValidators(Validators.maxLength(250));
            if (service?.modoPrecio === 'VARIABLE') {
                amount.enable({ emitEvent: false }); amount.setValidators([Validators.required, Validators.min(0)]);
            } else {
                const detail = this.store.detail();
                const fixedValue = this.isEditMode() && this.originalRequiresPayment && detail ? detail.importe : service?.precioBase ?? null;
                amount.setValue(fixedValue, { emitEvent: false }); amount.clearValidators(); amount.disable({ emitEvent: false });
            }
        }
        amount.updateValueAndValidity({ emitEvent: false }); reason.updateValueAndValidity({ emitEvent: false });
        if (initialDetail && this.store.detail()?.motivoNoPago) reason.setValue(this.store.detail()!.motivoNoPago!, { emitEvent: false });
    }

    private setupSearches(): void {
        this.form.controls.serviceSearch.valueChanges.pipe(map(value => value.trim()), debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(value => this.store.searchServices(value));
        this.form.controls.personaSearch.valueChanges.pipe(map(value => value.trim()), debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(value => this.store.searchPersons(value));
    }

    private nullableText(value: string): string | null { const text = value.trim(); return text || null; }
}
