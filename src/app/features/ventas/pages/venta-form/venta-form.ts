import { Component, DestroyRef, OnInit, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { PersonaSearchItem } from '../../../personas/data-access/models/persona-api.models';
import { VentaFormStore } from '../../data-access/models/venta-form.store';
import { VentaProductoBusqueda, VentaSolicitudPendiente } from '../../data-access/models/venta-lookup.models';
import { VentaCreateRequest } from '../../data-access/models/venta-write.models';

@Component({
    selector: 'pcr-venta-form',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule
    ],
    providers: [VentaFormStore],
    templateUrl: './venta-form.html',
    styleUrl: './venta-form.scss'
})
export class VentaFormPage implements OnInit {
    protected readonly store = inject(VentaFormStore);
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly feedback = inject(FeedbackService);

    protected readonly form = this.fb.group({
        idPersona: this.fb.control<number | null>(null, Validators.required),
        idTipoDocumento: this.fb.control<number | null>(null),
        numeroDocumento: this.fb.nonNullable.control('', Validators.maxLength(20)),
        nombre: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(250)]),
        telefono: this.fb.nonNullable.control('', Validators.maxLength(20)),

        productoSearch: this.fb.nonNullable.control(''),
        servicioSearch: this.fb.nonNullable.control(''),

        idTipoComprobante: this.fb.control<number | null>(null, Validators.required),
        idMetodoPago: this.fb.control<number | null>(null, Validators.required),
        montoRecibido: this.fb.control<number | null>(null, Validators.min(0)),
        observaciones: this.fb.nonNullable.control('', Validators.maxLength(500))
    });

    protected isCash(): boolean {
        const id = this.form.controls.idMetodoPago.value;
        return this.store.metodosPago().find(item => item.idMetodoPago === id)?.codigo === 'EFECTIVO';
    }

    private readonly syncInitialPerson = effect(() => {
        const person = this.store.initialPerson();
        if (!person || this.form.controls.idPersona.value !== null) return;
        this.patchClient({
            idPersona: person.idPersona,
            idTipoDocumento: person.idTipoDocumento,
            numeroDocumento: person.numeroDocumento,
            nombreCompleto: person.nombreCompleto,
            telefono: person.telefono
        });
    });

    private readonly syncDocumentPerson = effect(() => {
        const person = this.store.documentPerson();
        if (!person) return;
        this.patchClient({
            idPersona: person.idPersona,
            idTipoDocumento: person.idTipoDocumento,
            numeroDocumento: person.numeroDocumento,
            nombreCompleto: person.nombreCompleto,
            telefono: person.telefono
        });
    });

    private readonly syncCreatedPerson = effect(() => {
        const result = this.store.createdPerson();
        if (!result) return;
        this.form.controls.idPersona.setValue(result.idPersona, { emitEvent: false });
        this.feedback.success(result.mensaje || 'Persona registrada correctamente.');
        this.store.clearCreatedPerson();
    });

    private readonly syncErrors = effect(() => {
        const message = this.store.error() || this.store.saveError() || this.store.createPersonError();
        if (message) this.feedback.error(message);
    });

    private readonly syncSaveResult = effect(() => {
        const result = this.store.saveResult();
        if (!result) return;

        const message = result.mensaje || `Venta ${result.numeroComprobante} registrada correctamente.`;
        const fromMisa = this.route.snapshot.queryParamMap.get('origen') === 'misa';
        this.store.clearSaveResult();

        this.feedback.success(message);

        if (fromMisa) {
            void this.router.navigate(['/misas']);
            return;
        }

        this.resetForNextSale();
    });

    ngOnInit(): void {
        this.setupSearches();

        const rawServiceId = this.route.snapshot.queryParamMap.get('solicitudServicioId');
        const initialServiceId = rawServiceId === null ? null : Number(rawServiceId);

        if (rawServiceId !== null && (!Number.isInteger(initialServiceId) || initialServiceId! <= 0)) {
            this.feedback.warning('La solicitud de servicio indicada no es válida.');
            this.store.initialize(null);
            return;
        }

        this.store.initialize(initialServiceId);
    }

    protected searchDocument(): void {
        const idTipoDocumento = this.form.controls.idTipoDocumento.value;
        const numeroDocumento = this.form.controls.numeroDocumento.value.trim();

        if (!idTipoDocumento || !numeroDocumento) {
            this.feedback.info('Selecciona el tipo de documento e ingresa el número.');
            return;
        }

        this.store.findPersonByDocument(idTipoDocumento, numeroDocumento);
    }

    protected selectPerson(person: PersonaSearchItem): void {
        this.patchClient(person);
        this.store.clearPersonSearch();
    }

    protected clearClient(): void {
        this.form.patchValue({
            idPersona: null,
            idTipoDocumento: null,
            numeroDocumento: '',
            nombre: '',
            telefono: ''
        }, { emitEvent: false });
        this.store.clearDocumentPerson();
        this.store.clearPersonSearch();
    }

    protected registerPerson(): void {
        this.form.controls.nombre.markAsTouched();
        if (!this.form.controls.nombre.value.trim()) return;

        this.store.createPerson({
            idTipoDocumento: this.form.controls.idTipoDocumento.value,
            numeroDocumento: this.nullableText(this.form.controls.numeroDocumento.value),
            nombreCompleto: this.nullableText(this.form.controls.nombre.value),
            fechaNacimiento: null,
            telefono: this.nullableText(this.form.controls.telefono.value),
            email: null,
            direccion: null,
            roles: []
        });
    }

    protected selectProduct(product: VentaProductoBusqueda): void {
        if (product.stockActual <= 0) {
            this.feedback.warning('El producto no tiene stock disponible.');
            return;
        }

        if (!this.store.addProduct(product)) {
            this.feedback.warning('El producto ya se encuentra en el detalle de venta.');
            return;
        }

        this.form.controls.productoSearch.setValue('', { emitEvent: false });
    }

    protected selectService(service: VentaSolicitudPendiente): void {
        if (!this.store.addService(service)) {
            this.feedback.warning('El servicio ya se encuentra en el detalle de venta.');
            return;
        }

        this.form.controls.servicioSearch.setValue('', { emitEvent: false });

        if (this.form.controls.idPersona.value === null && service.idPersona) {
            this.form.patchValue({
                idPersona: service.idPersona,
                numeroDocumento: service.numeroDocumento ?? '',
                nombre: service.nombreCompleto ?? '',
                telefono: service.telefono ?? ''
            }, { emitEvent: false });
        }
    }

    protected updateQuantity(idProducto: number, rawValue: string): void {
        const message = this.store.updateProductQuantity(idProducto, Number(rawValue));
        if (message) {
            this.feedback.warning(message);
        }
    }

    protected removeItem(key: string): void {
        this.store.removeItem(key);
    }

    protected changeAmount(): number {
        if (!this.isCash()) return 0;
        const received = this.form.controls.montoRecibido.value ?? 0;
        return Math.max(0, Math.round((received - this.store.total()) * 100) / 100);
    }

    protected missingAmount(): number {
        if (!this.isCash()) return 0;
        const received = this.form.controls.montoRecibido.value ?? 0;
        return Math.max(0, Math.round((this.store.total() - received) * 100) / 100);
    }

    protected canSave(): boolean {
        if (
            this.store.saving() ||
            this.form.invalid ||
            this.store.items().length === 0 ||
            this.store.hasInvalidItems()
        ) {
            return false;
        }

        if (this.isCash()) {
            const received = this.form.controls.montoRecibido.value;
            return (received !== null && received >= this.store.total());
        }

        return true;
    }

    protected save(): void {
        this.form.markAllAsTouched();

        if (this.form.controls.idPersona.invalid) {
            this.feedback.warning('Selecciona o registra el cliente de la venta.');
            return;
        }

        if (this.store.items().length === 0) {
            this.feedback.warning('Agrega al menos un producto o servicio al detalle de venta.');
            return;
        }

        if (this.store.hasInvalidItems()) {
            this.feedback.warning('Corrige las cantidades inválidas del detalle de venta.');
            return;
        }

        if (this.isCash()) {
            const received = this.form.controls.montoRecibido.value;

            if (received === null) {
                this.feedback.warning('Ingresa el monto recibido.');
                return;
            }

            if (received < 0) {
                this.feedback.warning('El monto recibido no puede ser negativo.');
                return;
            }

            if (received < this.store.total()) {
                this.feedback.warning(`Falta S/ ${this.missingAmount().toFixed(2)} para completar el pago.`);
                return;
            }
        }

        if (this.form.invalid) return;

        this.store.createSale(this.buildRequest());
    }

    private buildRequest(): VentaCreateRequest {
        const value = this.form.getRawValue();

        return {
            idPersona: value.idPersona,
            idTipoComprobante: value.idTipoComprobante!,
            idMetodoPago: value.idMetodoPago!,
            observaciones: this.nullableText(value.observaciones),
            items: this.store.items().map(item => ({
                tipoItem: item.tipoItem,
                idProducto: item.idProducto,
                idSolicitudServicio: item.idSolicitudServicio,
                cantidad: item.cantidad
            }))
        };
    }

    private setupSearches(): void {
        this.form.controls.productoSearch.valueChanges
            .pipe(map(value => value.trim()), debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe(value => this.store.searchProducts(value));

        this.form.controls.servicioSearch.valueChanges
            .pipe(map(value => value.trim()), debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe(value => this.store.searchServices(value));

        this.form.controls.nombre.valueChanges
            .pipe(map(value => value.trim()), debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                if (this.form.controls.idPersona.value !== null) return;
                this.store.searchPersons(value);
            });

        this.form.controls.idMetodoPago.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                const control = this.form.controls.montoRecibido;
                control.setValue(null, { emitEvent: false });
                control.setValidators(this.isCash() ? [Validators.required, Validators.min(0)] : Validators.min(0));
                control.updateValueAndValidity({ emitEvent: false });
            });
    }

    private patchClient(person: { idPersona: number; idTipoDocumento?: number | null; numeroDocumento?: string | null; nombreCompleto?: string | null; telefono?: string | null; }): void {
        this.form.patchValue({
            idPersona: person.idPersona,
            idTipoDocumento: person.idTipoDocumento ?? null,
            numeroDocumento: person.numeroDocumento ?? '',
            nombre: person.nombreCompleto ?? '',
            telefono: person.telefono ?? ''
        }, { emitEvent: false });
    }

    private resetForNextSale(): void {
        this.form.reset({
            idPersona: null,
            idTipoDocumento: null,
            numeroDocumento: '',
            nombre: '',
            telefono: '',
            productoSearch: '',
            servicioSearch: '',
            idTipoComprobante: null,
            idMetodoPago: null,
            montoRecibido: null,
            observaciones: ''
        });
        this.store.items().forEach(item => this.store.removeItem(item.key));
    }

    private nullableText(value: string): string | null {
        const text = value.trim();
        return text || null;
    }
}
