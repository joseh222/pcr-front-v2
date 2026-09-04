import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MisaFormStore } from '../../data-access/models/misa-form.store';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonaSearchItem } from '../../../personas/data-access/models/persona-api.models';
import { EMPTY_MISA_INTENTION_RULE, MisaIntentionRule, resolveMisaIntentionRule } from '../../domain/misa-intention.rules';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MisaCreateRequest, MisaUpdateRequest, MisaWriteResponse } from '../../data-access/models/misa-write.models';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';


type MisaIntentionFormGroup = FormGroup<{ idIntencion: FormControl<number>; nombre: FormControl<string>; observacion: FormControl<string>; }>;

@Component({
    selector: 'pcr-misa-form',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatAutocompleteModule,
        RouterLink,
        MatCheckboxModule,
        MatDialogModule],
    providers: [MisaFormStore],
    templateUrl: './misa-form.html',
    styleUrl: './misa-form.scss'
})
export class MisaFormPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly feedback = inject(FeedbackService);
    private readonly dialog = inject(MatDialog);
    private readonly authStore = inject(AuthStore);

    protected readonly store = inject(MisaFormStore);
    protected readonly idMisa = signal<number | null>(null);
    protected readonly returnUrl = signal('/misas');
    protected readonly intentionRule = signal<MisaIntentionRule>(EMPTY_MISA_INTENTION_RULE);
    protected get intenciones(): FormArray<MisaIntentionFormGroup> { return this.form.controls.intenciones; }


    readonly form = this.fb.group({
        idModalidad: this.fb.control<number | null>(null, Validators.required),
        idTipo: this.fb.control<number | null>(null, Validators.required),
        fecha: this.fb.nonNullable.control('', Validators.required),
        hora: this.fb.nonNullable.control('', Validators.required),

        idPersona: this.fb.control<number | null>(null),
        idTipoDocumento: this.fb.control<number | null>(null),
        numeroDocumento: this.fb.nonNullable.control('', Validators.maxLength(20)),
        nombre: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(250)]),
        telefono: this.fb.nonNullable.control('', Validators.maxLength(20)),

        intenciones: this.fb.array<MisaIntentionFormGroup>([]),

        idSanto: this.fb.control<number | null>(null),
        motivo: this.fb.nonNullable.control('', Validators.maxLength(500)),
        ofrecen: this.fb.nonNullable.control('', Validators.maxLength(500)),
        celular: this.fb.nonNullable.control('', Validators.maxLength(20)),
        devotos: this.fb.nonNullable.control('', Validators.maxLength(500)),

        requierePago: this.fb.nonNullable.control(true),
        motivoNoPago: this.fb.nonNullable.control('', Validators.maxLength(250)),

        observaciones: this.fb.nonNullable.control('')
    });

    protected readonly isEditMode = computed(() => this.idMisa() !== null);
    protected readonly pageTitle = computed(() => this.isEditMode() ? 'Editar misa' : 'Nueva misa');
    protected readonly pageDescription = computed(() => this.isEditMode() ? 'Edita la información de la misa seleccionada.' : 'Registra una nueva misa e intenciones parroquiales.');

    private readonly syncDetail = effect(() => {
        const detail = this.store.detail();
        if (!detail) return;

        this.form.patchValue({
            idModalidad: detail.modalidad?.idModalidad ?? null,
            idTipo: detail.tipo?.idTipo ?? null,
            fecha: this.toDateInput(detail.fecha),
            hora: this.toTimeInput(detail.hora),

            idPersona: detail.solicitante?.idPersona ?? null,
            idTipoDocumento: detail.solicitante?.idTipoDocumento ?? null,
            numeroDocumento: detail.solicitante?.numeroDocumento ?? '',
            nombre: detail.solicitante?.nombre ?? '',
            telefono: detail.solicitante?.telefono ?? '',

            idSanto: detail.santo?.idSanto ?? null,
            motivo: detail.motivo ?? '',
            ofrecen: detail.ofrecen ?? '',
            celular: detail.celular ?? '',
            devotos: detail.devotos ?? '',

            requierePago: detail.solicitudServicio?.requierePago ?? true,
            motivoNoPago: detail.solicitudServicio?.motivoNoPago ?? '',

            observaciones: detail.observaciones ?? ''
        }, { emitEvent: false }
        );

        if (!detail.puedeEditar) {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }

        this.updateDocumentRules();
        this.onRequiresPaymentChange();
        this.setIntentions(detail.intenciones ?? []);
        this.applyIntentionRules(false);
    });



    private readonly syncDocumentPerson = effect(() => {
        const person = this.store.documentPerson();
        if (!person) return;

        this.form.patchValue({
            idPersona: person.idPersona,
            idTipoDocumento: person.idTipoDocumento,
            numeroDocumento: person.numeroDocumento ?? '',
            nombre: person.nombreCompleto ?? '',
            telefono: person.telefono ?? ''
        }, { emitEvent: false });

        this.updateDocumentRules();
    });

    ngOnInit(): void {
        this.setupPersonSearch();
        const requestedReturnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (requestedReturnUrl?.startsWith('/misas')) this.returnUrl.set(requestedReturnUrl);

        const rawId = this.route.snapshot.paramMap.get('id');

        if (rawId === null) {
            const fecha = this.route.snapshot.queryParamMap.get('fecha');
            const hora = this.route.snapshot.queryParamMap.get('hora');
            this.form.patchValue({
                fecha: /^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '') ? fecha! : '',
                hora: /^\d{2}:\d{2}$/.test(hora ?? '') ? hora! : ''
            }, { emitEvent: false });
            this.store.initialize(null);
            return;
        }

        const idMisa = Number(rawId);

        if (!Number.isInteger(idMisa) || idMisa <= 0) {
            this.navigateBack();
            return;
        }

        this.idMisa.set(idMisa);
        this.store.initialize(idMisa);
    }

    private setIntentions(intenciones: readonly { idIntencion: number; nombre: string | null; observacion: string | null; }[]): void {
        this.intenciones.clear();
        intenciones.forEach(item => this.intenciones.push(this.createIntentionGroup(item.idIntencion, item.nombre ?? '', item.observacion ?? '')));
    }

    protected addIntention(): void {
        const max = this.intentionRule().max;
        if (max !== null && this.intenciones.length >= max) return;
        this.intenciones.push(this.createIntentionGroup());
    }
    protected removeIntention(index: number): void {
        if (this.intenciones.length <= this.intentionRule().min) return;
        this.intenciones.removeAt(index);
    }
    protected canAddIntention(): boolean {
        const max = this.intentionRule().max;
        return max === null || this.intenciones.length < max;
    }
    protected canRemoveIntention(): boolean {
        return this.intenciones.length > this.intentionRule().min;
    }

    private createIntentionGroup(idIntencion = 0, nombre = '', observacion = ''): MisaIntentionFormGroup {
        return this.fb.group({
            idIntencion: this.fb.nonNullable.control(idIntencion),
            nombre: this.fb.nonNullable.control(nombre, [Validators.required, Validators.maxLength(100)]),
            observacion: this.fb.nonNullable.control(observacion, Validators.maxLength(200))
        });
    }
    protected onMisaContextChanged(): void {
        this.applyIntentionRules(true);
    }
    private applyIntentionRules(reset: boolean): void {
        const idModalidad = this.form.controls.idModalidad.value;
        const idTipo = this.form.controls.idTipo.value;
        const codigoTipo = this.store.tipos().find(tipo => tipo.idTipo === idTipo)?.codigo ?? null;
        const rule = resolveMisaIntentionRule(idModalidad, codigoTipo);

        this.intentionRule.set(rule);

        if (reset) this.intenciones.clear();

        if (!rule.showSanto) this.form.controls.idSanto.setValue(null, { emitEvent: false });
        if (!rule.showMotivo) this.form.controls.motivo.setValue('', { emitEvent: false });
        if (!rule.showOfrecen) this.form.controls.ofrecen.setValue('', { emitEvent: false });
        if (!rule.showCelular) this.form.controls.celular.setValue('', { emitEvent: false });
        if (!rule.showDevotos) this.form.controls.devotos.setValue('', { emitEvent: false });

        if (!rule.showIntentions) {
            this.intenciones.clear();
            return;
        }

        if (rule.max !== null) {
            while (this.intenciones.length > rule.max) this.intenciones.removeAt(this.intenciones.length - 1);
        }

        while (this.intenciones.length < rule.min) this.intenciones.push(this.createIntentionGroup());
    }

    private toDateInput(value: string | null): string { return value?.slice(0, 10) ?? ''; }
    private toTimeInput(value: string | null): string { return value?.slice(0, 5) ?? ''; }

    protected onDocumentTypeChange(): void {
        const wasLinked = this.form.controls.idPersona.value !== null;
        this.form.controls.numeroDocumento.setValue('', { emitEvent: false });
        this.unlinkPerson(wasLinked);
        this.updateDocumentRules();
    }
    protected onDocumentChanged(): void {
        const wasLinked = this.form.controls.idPersona.value !== null;
        this.unlinkPerson(wasLinked);
    }

    protected searchDocument(): void {
        const idTipoDocumento = this.form.controls.idTipoDocumento.value;
        const numeroDocumento = this.form.controls.numeroDocumento.value.trim();

        this.updateDocumentRules();
        this.form.controls.numeroDocumento.markAsTouched();

        if (!idTipoDocumento || this.form.controls.numeroDocumento.invalid) return;

        this.form.controls.idPersona.setValue(null, { emitEvent: false });
        this.store.findPersonByDocument(idTipoDocumento, numeroDocumento);
    }
    private unlinkPerson(clearData: boolean): void {
        this.form.controls.idPersona.setValue(null, { emitEvent: false });
        this.store.clearDocumentPerson();
        if (clearData) this.form.patchValue({ nombre: '', telefono: '' }, { emitEvent: false });
    }
    private updateDocumentRules(): void {
        const control = this.form.controls.numeroDocumento;
        const idTipoDocumento = this.form.controls.idTipoDocumento.value;
        const tipo = this.store.tiposDocumento().find(item => item.idTipoDocumento === idTipoDocumento);

        if (!tipo) {
            control.setValidators(Validators.maxLength(20));
            control.updateValueAndValidity({ emitEvent: false });
            return;
        }

        const validators = [Validators.required];

        if (tipo.longitudMinima) validators.push(Validators.minLength(tipo.longitudMinima));
        if (tipo.longitudMaxima) validators.push(Validators.maxLength(tipo.longitudMaxima));
        else validators.push(Validators.maxLength(20));
        if (tipo.soloNumeros) validators.push(Validators.pattern(/^\d+$/));

        control.setValidators(validators);
        control.updateValueAndValidity({ emitEvent: false });
    }

    private setupPersonSearch(): void {
        this.form.controls.nombre.valueChanges
            .pipe(
                map(value => value.trim()),
                debounceTime(300),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(value => {
                if (this.form.controls.idPersona.value !== null) {
                    this.form.controls.idPersona.setValue(null, { emitEvent: false });
                    this.store.clearDocumentPerson();
                }

                this.store.searchPersons(value);
            });
    }

    protected selectPerson(person: PersonaSearchItem): void {
        this.form.patchValue({
            idPersona: person.idPersona,
            idTipoDocumento: person.idTipoDocumento,
            numeroDocumento: person.numeroDocumento ?? '',
            nombre: person.nombreCompleto ?? '',
            telefono: person.telefono ?? ''
        }, { emitEvent: false });

        this.updateDocumentRules();
        this.store.clearDocumentPerson();
        this.store.clearPersonSearch();
    }

    protected onRequiresPaymentChange(): void {
        const control = this.form.controls.motivoNoPago;

        if (this.form.controls.requierePago.value) {
            control.setValue('', { emitEvent: false });
            control.setValidators(Validators.maxLength(250));
        } else {
            control.setValidators([Validators.required, Validators.maxLength(250)]);
        }

        control.updateValueAndValidity({ emitEvent: false });
    }

    private nullableText(value: string): string | null {
        const text = value.trim();
        return text || null;
    }

    private apiTime(value: string): string {
        return value.length === 5 ? `${value}:00` : value;
    }

    private buildCommonRequest() {
        const value = this.form.getRawValue();

        return {
            modalidad: { idModalidad: value.idModalidad! },
            tipo: { idTipo: value.idTipo! },

            solicitante: {
                idPersona: value.idPersona,
                idTipoDocumento: value.idTipoDocumento,
                numeroDocumento: this.nullableText(value.numeroDocumento),
                nombre: this.nullableText(value.nombre),
                telefono: this.nullableText(value.telefono)
            },

            fecha: value.fecha,
            hora: this.apiTime(value.hora),

            observaciones: this.nullableText(value.observaciones),

            requierePago: value.requierePago,
            motivoNoPago: value.requierePago ? null : this.nullableText(value.motivoNoPago),

            motivo: this.nullableText(value.motivo),
            ofrecen: this.nullableText(value.ofrecen),
            celular: this.nullableText(value.celular),
            devotos: this.nullableText(value.devotos),

            santo: value.idSanto ? { idSanto: value.idSanto } : null
        };
    }

    private buildCreateRequest(): MisaCreateRequest {
        const value = this.form.getRawValue();

        return {
            ...this.buildCommonRequest(),

            intenciones: value.intenciones.map(item => ({
                nombre: item.nombre.trim(),
                observacion: this.nullableText(item.observacion)
            }))
        };
    }

    private buildUpdateRequest(): MisaUpdateRequest {
        const value = this.form.getRawValue();

        return {
            ...this.buildCommonRequest(),

            intenciones: value.intenciones.map(item => ({
                idIntencion: item.idIntencion,
                nombre: item.nombre.trim(),
                observacion: this.nullableText(item.observacion)
            }))
        };
    }

    protected save(): void {
        this.onRequiresPaymentChange();

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const idMisa = this.idMisa();

        if (idMisa === null) {
            this.store.create(this.buildCreateRequest());
            return;
        }

        if (this.store.detail()?.puedeEditar === false) return;

        this.store.update(idMisa, this.buildUpdateRequest());
    }

    private readonly syncSaveResult = effect(() => {
        const result = this.store.saveResult();
        if (!result) return;

        const wasEditMode = this.isEditMode();
        this.store.clearSaveResult();

        if (!wasEditMode && result.requierePago && this.authStore.hasPermission(PERMISSION_CODE.SALE_CREATE)) {
            const dialogRef = this.dialog.open(ConfirmActionDialog, {
                width: '440px',
                disableClose: true,
                data: {
                    title: 'Misa registrada',
                    message: 'La misa se registró correctamente y quedó pendiente de pago. ¿Deseas registrar la venta ahora?',
                    cancelText: 'Más tarde',
                    confirmText: 'Vender ahora',
                    icon: 'check_circle'
                }
            });

            dialogRef.afterClosed().subscribe(sellNow => {
                if (sellNow) {
                    void this.router.navigate(['/ventas/nueva'], {
                        queryParams: { solicitudServicioId: result.idSolicitudServicio, origen: 'misa', returnUrl: this.returnUrl() }
                    });
                    return;
                }

                this.navigateBack();
            });
            return;
        }

        const message = this.getSaveSuccessMessage(result, wasEditMode);
        void this.router.navigateByUrl(this.returnUrl()).then(() => this.feedback.success(message));
    });

    private readonly syncSaveError = effect(() => {
        const message = this.store.saveError();

        if (!message) return;

        this.feedback.error(message);
    });

    protected navigateBack(): void {
        void this.router.navigateByUrl(this.returnUrl());
    }

    private getSaveSuccessMessage(result: MisaWriteResponse, wasEditMode: boolean): string {
        const backendMessage = result.mensaje?.trim();

        if (wasEditMode) {
            return backendMessage || 'Misa actualizada correctamente.';
        }

        const message = backendMessage || 'Misa registrada correctamente.';

        return message;
    }
}