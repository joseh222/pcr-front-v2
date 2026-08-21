import { Component, DestroyRef, OnInit, effect, inject } from '@angular/core';
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
import { InventarioMovementStore } from '../../data-access/models/inventario-movement.store';
import { MovimientoInventarioCreateRequest, TipoMovimientoInventario } from '../../data-access/models/inventario.models';

@Component({
    selector: 'pcr-movimiento-form',
    imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    providers: [InventarioMovementStore],
    templateUrl: './movimiento-form.html',
    styleUrl: './movimiento-form.scss'
})
export class MovimientoFormPage implements OnInit {
    protected readonly store = inject(InventarioMovementStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly feedback = inject(FeedbackService);
    protected idProducto = 0;
    private requestedType: string | null = null;
    protected initialStockFlow = false;

    readonly form = this.fb.group({
        idTipoMovimiento: this.fb.control<number | null>(null, Validators.required),
        cantidad: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
        costoUnitario: this.fb.control<number | null>(null, Validators.min(0)),
        motivo: this.fb.nonNullable.control('', Validators.maxLength(250))
    });

    private readonly syncRequestedType = effect(() => {
        const inventory = this.store.inventory();
        const types = this.store.tipos();
        if (!inventory || !types.length || !this.requestedType || this.form.controls.idTipoMovimiento.value !== null) return;

        const code = this.requestedType.toUpperCase();
        const type = types.find(item => item.codigo === code);
        this.requestedType = null;

        if (!type) return;
        if (type.codigo === 'STOCK_INICIAL' && !this.canRegisterInitialStock()) {
            this.feedback.warning('El stock inicial solo puede registrarse como primer movimiento del producto.');
            return;
        }

        this.form.controls.idTipoMovimiento.setValue(type.idTipoMovimiento);
        if (type.codigo === 'STOCK_INICIAL' && this.initialStockFlow) this.form.controls.idTipoMovimiento.disable({ emitEvent: false });
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
        void this.router.navigate(['/productos', result.idProducto]).then(() => this.feedback.success(result.mensaje || 'Movimiento registrado correctamente.'));
    });

    ngOnInit(): void {
        this.idProducto = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isInteger(this.idProducto) || this.idProducto <= 0) { void this.router.navigate(['/productos']); return; }
        this.requestedType = this.route.snapshot.queryParamMap.get('tipo');
        this.initialStockFlow = this.requestedType?.toUpperCase() === 'STOCK_INICIAL';
        this.form.controls.idTipoMovimiento.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.applyReasonValidators());
        this.store.initialize(this.idProducto);
    }

    protected availableTypes(): readonly TipoMovimientoInventario[] {
        return this.canRegisterInitialStock() ? this.store.tipos() : this.store.tipos().filter(item => item.codigo !== 'STOCK_INICIAL');
    }

    protected selectedType(): TipoMovimientoInventario | null {
        const id = this.form.controls.idTipoMovimiento.value;
        return this.store.tipos().find(item => item.idTipoMovimiento === id) ?? null;
    }

    protected requiresReason(): boolean {
        const code = this.selectedType()?.codigo;
        return code === 'AJUSTE_ENTRADA' || code === 'AJUSTE_SALIDA' || code === 'MERMA';
    }

    protected canRegisterInitialStock(): boolean {
        const inventory = this.store.inventory();
        return !!inventory && inventory.stockActual === 0 && inventory.fechaUltimoMovimiento === null;
    }

    protected projectedStock(): number | null {
        const inventory = this.store.inventory();
        const type = this.selectedType();
        const quantity = this.form.controls.cantidad.value;
        if (!inventory || !type || quantity == null || quantity <= 0) return null;
        const result = type.naturaleza === 'E' ? inventory.stockActual + quantity : inventory.stockActual - quantity;
        return Math.round(result * 100) / 100;
    }

    protected hasInsufficientStock(): boolean {
        const inventory = this.store.inventory();
        const type = this.selectedType();
        const quantity = this.form.controls.cantidad.value;
        return !!inventory && type?.naturaleza === 'S' && quantity != null && quantity > inventory.stockActual;
    }

    protected canSave(): boolean {
        if (this.form.invalid || this.store.saving() || this.hasInsufficientStock()) return false;
        const type = this.selectedType();
        if (!type) return false;
        return type.codigo !== 'STOCK_INICIAL' || this.canRegisterInitialStock();
    }

    protected save(): void {
        this.form.markAllAsTouched();
        if (this.hasInsufficientStock()) { this.feedback.warning('Stock insuficiente para realizar el movimiento.'); return; }
        if (!this.canSave()) return;

        const type = this.selectedType();
        if (!type) return;
        if (type.codigo === 'STOCK_INICIAL' && !this.canRegisterInitialStock()) {
            this.feedback.warning('El stock inicial solo puede registrarse como primer movimiento del producto.');
            return;
        }

        const value = this.form.getRawValue();
        const request: MovimientoInventarioCreateRequest = {
            idTipoMovimiento: value.idTipoMovimiento!, cantidad: value.cantidad!, costoUnitario: value.costoUnitario,
            motivo: this.nullable(value.motivo)
        };
        this.store.create(this.idProducto, request);
    }

    private applyReasonValidators(): void {
        const control = this.form.controls.motivo;
        control.setValidators(this.requiresReason() ? [Validators.required, Validators.maxLength(250)] : Validators.maxLength(250));
        control.updateValueAndValidity({ emitEvent: false });
    }

    private nullable(value: string): string | null { const text = value.trim(); return text || null; }
}
