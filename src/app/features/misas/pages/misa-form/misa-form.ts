import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MisaFormStore } from '../../data-access/models/misa-form.store';

@Component({
    selector: 'pcr-misa-form',
    imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, RouterLink],
    providers: [MisaFormStore],
    templateUrl: './misa-form.html',
    styleUrl: './misa-form.scss'
})
export class MisaFormPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    protected readonly store = inject(MisaFormStore);
    protected readonly idMisa = signal<number | null>(null);

    readonly form = this.fb.group({
        idModalidad: this.fb.control<number | null>(null, Validators.required),
        idTipo: this.fb.control<number | null>(null, Validators.required),
        fecha: this.fb.nonNullable.control('', Validators.required),
        hora: this.fb.nonNullable.control('', Validators.required)
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
            hora: this.toTimeInput(detail.hora)
        });
    });

    ngOnInit(): void {
        const rawId = this.route.snapshot.paramMap.get('id');

        if (rawId === null) {
            this.store.initialize(null);
            return;
        }

        const idMisa = Number(rawId);

        if (!Number.isInteger(idMisa) || idMisa <= 0) {
            void this.router.navigate(['/misas']);
            return;
        }

        this.idMisa.set(idMisa);
        this.store.initialize(idMisa);
    }

    private toDateInput(value: string | null): string { return value?.slice(0, 10) ?? ''; }
    private toTimeInput(value: string | null): string { return value?.slice(0, 5) ?? ''; }
}