import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ServicioModoPrecio } from '../../data-access/models/servicio-catalog.models';
import { ServicioFormStore } from '../../data-access/models/servicio-form.store';
import { ServicioCreateRequest, ServicioUpdateRequest } from '../../data-access/models/servicio-write.models';

@Component({
    selector: 'pcr-servicio-form',
    imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    providers: [ServicioFormStore],
    templateUrl: './servicio-form.html',
    styleUrl: './servicio-form.scss'
})
export class ServicioFormPage implements OnInit {
    protected readonly store = inject(ServicioFormStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly feedback = inject(FeedbackService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly idServicio = signal<number | null>(null);
    protected readonly isEditMode = computed(() => this.idServicio() !== null);
    protected readonly pageTitle = computed(() => this.isEditMode() ? 'Editar servicio' : 'Nuevo servicio');
    protected readonly pageDescription = computed(() => this.isEditMode()
        ? 'Actualiza la categoría, descripción y configuración comercial del servicio.'
        : 'Registra un servicio que podrá ser utilizado por las solicitudes de la parroquia.');

    readonly form = this.fb.group({
        codigo: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9_]+$/)]),
        idCategoriaServicio: this.fb.control<number | null>(null, Validators.required),
        nombre: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(150)]),
        descripcion: this.fb.nonNullable.control('', Validators.maxLength(500)),
        modoPrecio: this.fb.control<ServicioModoPrecio>('FIJO', Validators.required),
        precioBase: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
        idTipoSacramentoRequerido:this.fb.control<number|null>(null)
    });

    private readonly syncDetail = effect(() => {
        const detail = this.store.detail();
        if (!detail) return;
        this.form.patchValue({
            codigo: detail.codigo,
            idCategoriaServicio: detail.idCategoriaServicio,
            nombre: detail.nombre,
            descripcion: detail.descripcion ?? '',
            modoPrecio: detail.modoPrecio,
            precioBase: detail.precioBase,
            idTipoSacramentoRequerido:detail.idTipoSacramentoRequerido
        }, { emitEvent: false });
        this.applyPricingMode(detail.modoPrecio, false);
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
        void this.router.navigate(['/catalogos/servicios']).then(() => this.feedback.success(result.mensaje || (this.isEditMode() ? 'Servicio actualizado correctamente.' : 'Servicio registrado correctamente.')));
    });

    constructor() {
        this.form.controls.modoPrecio.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(mode => {
            if (mode) this.applyPricingMode(mode, true);
        });
    }

    ngOnInit(): void {
        const rawId = this.route.snapshot.paramMap.get('id');
        if (rawId === null) { this.applyPricingMode('FIJO', false); this.store.initialize(null); return; }
        const id = Number(rawId);
        if (!Number.isInteger(id) || id <= 0) { void this.router.navigate(['/catalogos/servicios']); return; }
        this.idServicio.set(id); this.store.initialize(id);
    }

    protected save(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid || this.store.saving()) return;
        const id = this.idServicio();
        if (id === null) { this.store.create(this.buildCreateRequest()); return; }
        const rowVersion = this.store.detail()?.rowVersion;
        if (!rowVersion) { this.feedback.warning('Recarga el servicio antes de guardar los cambios.'); return; }
        this.store.update(id, this.buildUpdateRequest(rowVersion));
    }

    protected normalizeCode(): void {
        const code = this.form.controls.codigo.value.trim().replace(/\s+/g, '_').toUpperCase();
        this.form.controls.codigo.setValue(code, { emitEvent: false });
    }

    private applyPricingMode(mode: ServicioModoPrecio, clearWhenVariable: boolean): void {
        const control = this.form.controls.precioBase;
        if (mode === 'FIJO') {
            control.enable({ emitEvent: false });
            control.setValidators([Validators.required, Validators.min(0)]);
        } else {
            if (clearWhenVariable) control.setValue(null, { emitEvent: false });
            control.clearValidators();
            control.disable({ emitEvent: false });
        }
        control.updateValueAndValidity({ emitEvent: false });
    }

    private buildCreateRequest(): ServicioCreateRequest {
        const value = this.form.getRawValue();
        return {
            codigo: value.codigo.trim().replace(/\s+/g, '_').toUpperCase(),
            idCategoriaServicio: value.idCategoriaServicio!,
            nombre: value.nombre.trim(),
            descripcion: this.nullable(value.descripcion),
            modoPrecio: value.modoPrecio!,
            precioBase: value.modoPrecio === 'FIJO' ? value.precioBase : null,
            idTipoSacramentoRequerido:value.idTipoSacramentoRequerido
        };
    }

    private buildUpdateRequest(rowVersion: string): ServicioUpdateRequest {
        const value = this.form.getRawValue();
        return {
            idCategoriaServicio: value.idCategoriaServicio!,
            nombre: value.nombre.trim(),
            descripcion: this.nullable(value.descripcion),
            modoPrecio: value.modoPrecio!,
            precioBase: value.modoPrecio === 'FIJO' ? value.precioBase : null,
            idTipoSacramentoRequerido:value.idTipoSacramentoRequerido,
            actualizarTipoSacramento:true,
            rowVersion
        };
    }

    private nullable(value: string): string | null { const text = value.trim(); return text || null; }
}
