import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
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
        RouterLink],
    providers: [MisaFormStore],
    templateUrl: './misa-form.html',
    styleUrl: './misa-form.scss'
})
export class MisaFormPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly store = inject(MisaFormStore);
    protected readonly idMisa = signal<number | null>(null);

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

            observaciones: detail.observaciones ?? ''
        }, { emitEvent: false });

        this.updateDocumentRules();
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
}