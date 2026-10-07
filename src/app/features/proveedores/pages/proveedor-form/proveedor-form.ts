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
import { ProveedorTipoDocumento } from '../../data-access/models/proveedor-catalog.models';
import { ProveedorFormStore } from '../../data-access/models/proveedor-form.store';
import { ProveedorCreateRequest, ProveedorUpdateRequest } from '../../data-access/models/proveedor-write.models';

const documentPairValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const idTipoDocumento = control.get('idTipoDocumento')?.value as number | null;
    const numeroDocumento = String(control.get('numeroDocumento')?.value ?? '').trim();
    return Boolean(idTipoDocumento) === Boolean(numeroDocumento) ? null : { documentPair: true };
};

@Component({
    selector: 'pcr-proveedor-form',
    imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    providers: [ProveedorFormStore],
    templateUrl: './proveedor-form.html',
    styleUrl: './proveedor-form.scss'
})
export class ProveedorFormPage implements OnInit {
    protected readonly store = inject(ProveedorFormStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly feedback = inject(FeedbackService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly idProveedor = signal<number | null>(null);
    protected readonly isEditMode = computed(() => this.idProveedor() !== null);
    protected readonly selectedDocumentType = computed<ProveedorTipoDocumento | null>(() => {
        const id = this.selectedDocumentTypeId();
        return this.store.tiposDocumento().find(x => x.idTipoDocumento === id) ?? null;
    });
    private readonly selectedDocumentTypeId = signal<number | null>(null);

    protected readonly pageTitle = computed(() => this.isEditMode() ? 'Editar proveedor' : 'Nuevo proveedor');
    protected readonly pageDescription = computed(() => this.isEditMode()
        ? 'Actualiza los datos de identificación y contacto del proveedor.'
        : 'Registra una persona o empresa que podrá ser seleccionada en futuras compras.');

    readonly form = this.fb.group({
        idTipoDocumento: this.fb.control<number | null>(null),
        numeroDocumento: this.fb.nonNullable.control('', Validators.maxLength(20)),
        razonSocial: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(200)]),
        nombreComercial: this.fb.nonNullable.control('', Validators.maxLength(150)),
        telefono: this.fb.nonNullable.control('', Validators.maxLength(20)),
        email: this.fb.nonNullable.control('', [Validators.email, Validators.maxLength(150)]),
        direccion: this.fb.nonNullable.control('', Validators.maxLength(250)),
        observaciones: this.fb.nonNullable.control('', Validators.maxLength(500))
    }, { validators: documentPairValidator });

    private readonly syncDetail = effect(() => {
        const detail = this.store.detail();
        if (!detail) return;
        this.form.patchValue({
            idTipoDocumento: detail.idTipoDocumento,
            numeroDocumento: detail.numeroDocumento ?? '',
            razonSocial: detail.razonSocial,
            nombreComercial: detail.nombreComercial ?? '',
            telefono: detail.telefono ?? '',
            email: detail.email ?? '',
            direccion: detail.direccion ?? '',
            observaciones: detail.observaciones ?? ''
        }, { emitEvent: false });
        this.selectedDocumentTypeId.set(detail.idTipoDocumento);
        this.applyDocumentRules(detail.idTipoDocumento);
    });

    private readonly syncSaveError = effect(() => {
        const error = this.store.saveError();
        if (!error) return;
        this.feedback.error(error); this.store.clearSaveError();
    });

    private readonly syncSaveResult = effect(() => {
        const result = this.store.saveResult();
        if (!result) return;
        this.store.clearSaveResult();
        void this.router.navigate(['/catalogos/proveedores']).then(() =>
            this.feedback.success(result.mensaje || (this.isEditMode() ? 'Proveedor actualizado correctamente.' : 'Proveedor registrado correctamente.'))
        );
    });

    constructor() {
        this.form.controls.idTipoDocumento.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(id => {
            this.selectedDocumentTypeId.set(id);
            this.applyDocumentRules(id);
        });
    }

    ngOnInit(): void {
        const rawId = this.route.snapshot.paramMap.get('id');
        if (rawId === null) { this.store.initialize(null); return; }
        const id = Number(rawId);
        if (!Number.isInteger(id) || id <= 0) { void this.router.navigate(['/catalogos/proveedores']); return; }
        this.idProveedor.set(id); this.store.initialize(id);
    }

    protected save(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid || this.store.saving()) return;
        const id = this.idProveedor();
        if (id === null) { this.store.create(this.buildCreateRequest()); return; }
        const rowVersion = this.store.detail()?.rowVersion;
        if (!rowVersion) { this.feedback.warning('Recarga el proveedor antes de guardar los cambios.'); return; }
        this.store.update(id, this.buildUpdateRequest(rowVersion));
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
        const min = type.longitudMinima; const max = type.longitudMaxima;
        if (min !== null && max !== null && min === max) return `${type.nombre}: ${min} caracteres${type.soloNumeros ? ' numéricos' : ''}.`;
        if (min !== null && max !== null) return `${type.nombre}: entre ${min} y ${max} caracteres${type.soloNumeros ? ' numéricos' : ''}.`;
        return `${type.nombre}${type.soloNumeros ? ': solo números.' : '.'}`;
    }

    private applyDocumentRules(idTipoDocumento: number | null): void {
        const control = this.form.controls.numeroDocumento;
        const type = this.store.tiposDocumento().find(x => x.idTipoDocumento === idTipoDocumento) ?? null;
        const validators = [Validators.maxLength(20)];
        if (idTipoDocumento !== null) validators.push(Validators.required);
        if (type?.longitudMinima !== null && type?.longitudMinima !== undefined) validators.push(Validators.minLength(type.longitudMinima));
        if (type?.longitudMaxima !== null && type?.longitudMaxima !== undefined) validators.push(Validators.maxLength(type.longitudMaxima));
        if (type?.soloNumeros) validators.push(Validators.pattern(/^\d+$/));
        control.setValidators(validators);
        control.updateValueAndValidity({ emitEvent: false });
        this.form.updateValueAndValidity({ emitEvent: false });
    }

    private buildCreateRequest(): ProveedorCreateRequest {
        const value = this.form.getRawValue();
        const numeroDocumento = this.nullable(value.numeroDocumento)?.replace(/\s+/g, '').toUpperCase() ?? null;
        return {
            idTipoDocumento: value.idTipoDocumento,
            numeroDocumento,
            razonSocial: value.razonSocial.trim(),
            nombreComercial: this.nullable(value.nombreComercial),
            telefono: this.nullable(value.telefono),
            email: this.nullable(value.email)?.toLowerCase() ?? null,
            direccion: this.nullable(value.direccion),
            observaciones: this.nullable(value.observaciones)
        };
    }

    private buildUpdateRequest(rowVersion: string): ProveedorUpdateRequest {
        return { ...this.buildCreateRequest(), rowVersion };
    }

    private nullable(value: string): string | null { const text = value.trim(); return text || null; }
}
