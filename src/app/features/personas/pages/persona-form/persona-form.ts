import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { PersonaRolCatalogo, PersonaTipoDocumento } from '../../data-access/models/persona-api.models';
import { PersonaFormStore } from '../../data-access/models/persona-form.store';

const documentPairValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const idTipoDocumento = control.get('idTipoDocumento')?.value as number | null;
    const numeroDocumento = String(control.get('numeroDocumento')?.value ?? '').trim();
    return Boolean(idTipoDocumento) === Boolean(numeroDocumento) ? null : { documentPair: true };
};

const identifiableDataValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const values = ['numeroDocumento', 'nombreCompleto', 'telefono', 'email', 'direccion']
        .map(key => String(control.get(key)?.value ?? '').trim());
    return values.some(Boolean) ? null : { identifiableData: true };
};

const notFutureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) return null;
    const todayUtc = new Date().toISOString().slice(0, 10);
    return value <= todayUtc ? null : { futureDate: true };
};

@Component({
    selector: 'pcr-persona-form',
    imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    providers: [PersonaFormStore],
    templateUrl: './persona-form.html',
    styleUrl: './persona-form.scss'
})
export class PersonaFormPage implements OnInit {
    protected readonly store = inject(PersonaFormStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly feedback = inject(FeedbackService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly idPersona = signal<number | null>(null);
    protected readonly isEditMode = computed(() => this.idPersona() !== null);
    private readonly selectedDocumentTypeId = signal<number | null>(null);
    protected readonly selectedDocumentType = computed<PersonaTipoDocumento | null>(() =>
        this.store.tiposDocumento().find(item => item.idTipoDocumento === this.selectedDocumentTypeId()) ?? null
    );
    protected readonly pageTitle = computed(() => this.isEditMode() ? 'Editar persona' : 'Nueva persona');
    protected readonly pageDescription = computed(() => this.isEditMode()
        ? 'Actualiza la información general y los roles de la persona.'
        : 'Registra una persona una sola vez para reutilizarla en los distintos procesos de la parroquia.');
    protected readonly today = new Date().toISOString().slice(0, 10);

    readonly form = this.fb.group({
        idTipoDocumento: this.fb.control<number | null>(null),
        numeroDocumento: this.fb.nonNullable.control('', Validators.maxLength(20)),
        nombreCompleto: this.fb.nonNullable.control('', Validators.maxLength(250)),
        fechaNacimiento: this.fb.nonNullable.control('', notFutureDateValidator),
        telefono: this.fb.nonNullable.control('', Validators.maxLength(20)),
        email: this.fb.nonNullable.control('', [Validators.email, Validators.maxLength(150)]),
        direccion: this.fb.nonNullable.control('', Validators.maxLength(250)),
        roles: this.fb.nonNullable.control<number[]>([])
    }, { validators: [documentPairValidator, identifiableDataValidator] });

    private readonly syncDetail = effect(() => {
        const detail = this.store.detail();
        if (!detail) return;
        this.form.patchValue({
            idTipoDocumento: detail.idTipoDocumento,
            numeroDocumento: detail.numeroDocumento ?? '',
            nombreCompleto: detail.nombreCompleto ?? '',
            fechaNacimiento: detail.fechaNacimiento?.slice(0, 10) ?? '',
            telefono: detail.telefono ?? '',
            email: detail.email ?? '',
            direccion: detail.direccion ?? '',
            roles: detail.roles.map(role => role.idRolPersona)
        }, { emitEvent: false });
        this.selectedDocumentTypeId.set(detail.idTipoDocumento);
        this.applyDocumentRules(detail.idTipoDocumento);
    });

    private readonly syncSaveError = effect(() => {
        const error = this.store.saveError();
        if (!error) return;
        this.feedback.error(error);
        this.store.clearSaveError();
    });

    private readonly syncSaveResult = effect(() => {
        const result = this.store.saveResult();
        if (!result) return;
        const wasEdit = this.isEditMode();
        this.store.clearSaveResult();
        void this.router.navigate(['/personas']).then(() =>
            this.feedback.success(result.mensaje || (wasEdit ? 'Persona actualizada correctamente.' : 'Persona registrada correctamente.'))
        );
    });

    constructor() {
        this.form.controls.idTipoDocumento.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(id => {
                this.selectedDocumentTypeId.set(id);
                this.applyDocumentRules(id);
            });
    }

    ngOnInit(): void {
        const rawId = this.route.snapshot.paramMap.get('id');
        if (rawId === null) {
            this.store.initialize(null);
            return;
        }

        const id = Number(rawId);
        if (!Number.isInteger(id) || id <= 0) {
            void this.router.navigate(['/personas']);
            return;
        }

        this.idPersona.set(id);
        this.store.initialize(id);
    }

    protected save(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid || this.store.saving()) return;

        const value = this.form.getRawValue();
        const common = {
            idTipoDocumento: value.idTipoDocumento,
            numeroDocumento: this.nullable(value.numeroDocumento)?.replace(/\s+/g, '').toUpperCase() ?? null,
            nombreCompleto: this.nullable(value.nombreCompleto),
            fechaNacimiento: this.nullable(value.fechaNacimiento),
            telefono: this.nullable(value.telefono),
            email: this.nullable(value.email)?.toLowerCase() ?? null,
            direccion: this.nullable(value.direccion),
            roles: [...new Set(value.roles)]
        };

        const id = this.idPersona();
        if (id === null) {
            this.store.create(common);
            return;
        }

        const rowVersion = this.store.detail()?.rowVersion;
        if (!rowVersion) {
            this.feedback.warning('Recarga la persona antes de guardar los cambios.');
            return;
        }

        this.store.update(id, { ...common, rowVersion });
    }

    protected normalizeDocument(): void {
        const control = this.form.controls.numeroDocumento;
        const type = this.selectedDocumentType();
        let value = control.value.trim().replace(/\s+/g, '').toUpperCase();
        if (type?.soloNumeros) value = value.replace(/\D/g, '');
        control.setValue(value, { emitEvent: false });
        this.form.updateValueAndValidity({ emitEvent: false });
    }

    protected documentHint(): string {
        const type = this.selectedDocumentType();
        if (!type) return 'Opcional. Si ingresas un número, selecciona también el tipo de documento.';
        const min = type.longitudMinima;
        const max = type.longitudMaxima;
        if (min !== null && max !== null && min === max) return `${type.nombre}: ${min} caracteres${type.soloNumeros ? ' numéricos' : ''}.`;
        if (min !== null && max !== null) return `${type.nombre}: entre ${min} y ${max} caracteres${type.soloNumeros ? ' numéricos' : ''}.`;
        return `${type.nombre}${type.soloNumeros ? ': solo números.' : '.'}`;
    }

    protected roleDescription(role: PersonaRolCatalogo): string {
        return role.descripcion?.trim() || role.nombre;
    }

    private applyDocumentRules(idTipoDocumento: number | null): void {
        const control = this.form.controls.numeroDocumento;
        const type = this.store.tiposDocumento().find(item => item.idTipoDocumento === idTipoDocumento) ?? null;
        const validators = [Validators.maxLength(20)];

        if (idTipoDocumento !== null) validators.push(Validators.required);
        if (type?.longitudMinima != null) validators.push(Validators.minLength(type.longitudMinima));
        if (type?.longitudMaxima != null) validators.push(Validators.maxLength(type.longitudMaxima));
        if (type?.soloNumeros) validators.push(Validators.pattern(/^\d+$/));

        control.setValidators(validators);
        control.updateValueAndValidity({ emitEvent: false });
        this.form.updateValueAndValidity({ emitEvent: false });
    }

    private nullable(value: string): string | null {
        const normalized = value.trim();
        return normalized || null;
    }
}
