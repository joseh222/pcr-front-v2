import { Component, DestroyRef, OnInit, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ProductoSearchItem } from '../../../productos/data-access/models/producto-read.models';
import { ProveedorSearchItem } from '../../../proveedores/data-access/models/proveedor-read.models';
import { CompraFormStore } from '../../data-access/models/compra-form.store';
import { CompraCreateRequest } from '../../data-access/models/compra-write.models';

function todayLocal(): string {
    const now = new Date();
    const y = now.getFullYear(); const m = `${now.getMonth() + 1}`.padStart(2, '0'); const d = `${now.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function notFutureDate(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '');
    return value && value > todayLocal() ? { futureDate: true } : null;
}

@Component({
    selector: 'pcr-compra-form',
    imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    providers: [CompraFormStore],
    templateUrl: './compra-form.html',
    styleUrl: './compra-form.scss'
})
export class CompraFormPage implements OnInit {
    protected readonly store = inject(CompraFormStore);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly feedback = inject(FeedbackService);
    private readonly router = inject(Router);
    protected readonly today = todayLocal();

    protected readonly form = this.fb.group({
        proveedorSearch: this.fb.nonNullable.control(''),
        idProveedor: this.fb.control<number | null>(null, Validators.required),
        fechaCompra: this.fb.nonNullable.control(this.today, [Validators.required, notFutureDate]),
        idTipoComprobanteCompra: this.fb.control<number | null>(null, Validators.required),
        serieComprobante: this.fb.nonNullable.control('', Validators.maxLength(20)),
        numeroComprobante: this.fb.nonNullable.control('', Validators.maxLength(30)),
        productoSearch: this.fb.nonNullable.control(''),
        observaciones: this.fb.nonNullable.control('', Validators.maxLength(500))
    });

    private readonly syncErrors = effect(() => {
        const message = this.store.loadError() || this.store.proveedorError() || this.store.productoError() || this.store.saveError();
        if (message) this.feedback.error(message);
    });

    private readonly syncSaveResult = effect(() => {
        const result = this.store.saveResult();
        if (!result) return;
        this.feedback.success(result.mensaje || `Compra ${result.codCompra} registrada correctamente.`);
        this.store.clearSaveResult();
        void this.router.navigate(['/compras']);
    });

    ngOnInit(): void {
        this.store.initialize();
        this.form.controls.proveedorSearch.valueChanges.pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(value => this.store.searchProveedores(value));
        this.form.controls.productoSearch.valueChanges.pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe(value => this.store.searchProductos(value));
        this.form.controls.idTipoComprobanteCompra.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.syncVoucherValidators());
    }

    protected selectProveedor(proveedor: ProveedorSearchItem): void {
        this.store.selectProveedor(proveedor); this.form.patchValue({ idProveedor: proveedor.idProveedor, proveedorSearch: '' }, { emitEvent: false });
    }

    protected clearProveedor(): void {
        this.store.clearProveedor(); this.form.patchValue({ idProveedor: null, proveedorSearch: '' }, { emitEvent: false });
    }

    protected addProduct(product: ProductoSearchItem): void {
        const result = this.store.addProduct(product);
        if (result === 'DUPLICATE') { this.feedback.warning('El producto ya se encuentra en la compra.'); return; }
        if (result === 'LIMIT') { this.feedback.warning('Una compra admite como máximo 100 productos.'); return; }
        this.form.controls.productoSearch.setValue('', { emitEvent: false });
    }

    protected updateQuantity(idProducto: number, value: string): void { this.store.updateQuantity(idProducto, Number(value)); }
    protected updateCost(idProducto: number, value: string): void { this.store.updateCost(idProducto, Number(value)); }
    protected removeProduct(idProducto: number): void { this.store.removeProduct(idProducto); }

    protected selectedVoucher() {
        const id = this.form.controls.idTipoComprobanteCompra.value;
        return this.store.tiposComprobante().find(item => item.idTipoComprobanteCompra === id) ?? null;
    }

    protected canSave(): boolean {
        return !this.store.saving() && this.form.valid && this.store.selectedProveedor() !== null && this.store.items().length > 0 && !this.store.hasInvalidItems();
    }

    protected save(): void {
        this.form.markAllAsTouched(); this.syncVoucherValidators();
        if (!this.canSave()) { this.feedback.warning('Completa los datos obligatorios y revisa el detalle de la compra.'); return; }
        const raw = this.form.getRawValue();
        const request: CompraCreateRequest = {
            idProveedor: raw.idProveedor!, idTipoComprobanteCompra: raw.idTipoComprobanteCompra!, fechaCompra: raw.fechaCompra,
            serieComprobante: this.nullableText(raw.serieComprobante), numeroComprobante: this.nullableText(raw.numeroComprobante),
            observaciones: this.nullableText(raw.observaciones),
            items: this.store.items().map(item => ({ idProducto: item.idProducto, cantidad: item.cantidad, costoUnitario: item.costoUnitario }))
        };
        this.store.create(request);
    }

    protected resetForm(): void {
        this.store.reset();
        this.form.reset({ proveedorSearch: '', idProveedor: null, fechaCompra: todayLocal(), idTipoComprobanteCompra: null, serieComprobante: '', numeroComprobante: '', productoSearch: '', observaciones: '' });
        this.syncVoucherValidators();
    }

    private syncVoucherValidators(): void {
        const voucher = this.selectedVoucher();
        const serie = this.form.controls.serieComprobante; const numero = this.form.controls.numeroComprobante;
        serie.setValidators(voucher?.requiereSerie ? [Validators.required, Validators.maxLength(20)] : [Validators.maxLength(20)]);
        numero.setValidators(voucher?.requiereNumero ? [Validators.required, Validators.maxLength(30)] : [Validators.maxLength(30)]);
        if (voucher?.codigo === 'SIN_COMPROBANTE') { serie.setValue('', { emitEvent: false }); numero.setValue('', { emitEvent: false }); }
        serie.updateValueAndValidity({ emitEvent: false }); numero.updateValueAndValidity({ emitEvent: false });
    }

    private nullableText(value: string): string | null { const normalized = value.trim(); return normalized || null; }
}
