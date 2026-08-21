import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { ProductoFormStore } from '../../data-access/models/producto-form.store';
import { ProductoCreateRequest, ProductoUpdateRequest } from '../../data-access/models/producto-write.models';

@Component({
    selector: 'pcr-producto-form',
    imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    providers: [ProductoFormStore],
    templateUrl: './producto-form.html',
    styleUrl: './producto-form.scss'
})
export class ProductoFormPage implements OnInit {
    protected readonly store = inject(ProductoFormStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly feedback = inject(FeedbackService);
    private readonly dialog = inject(MatDialog);
    protected readonly idProducto = signal<number | null>(null);
    protected readonly isEditMode = computed(() => this.idProducto() !== null);
    protected readonly pageTitle = computed(() => this.isEditMode() ? 'Editar producto' : 'Nuevo producto');
    protected readonly pageDescription = computed(() => this.isEditMode() ? 'Actualiza la información comercial del producto. El stock se administra desde Inventario.' : 'Registra un producto nuevo. Se creará con stock inicial 0.');

    readonly form = this.fb.group({
        idCategoriaProducto: this.fb.control<number | null>(null, Validators.required),
        idMarcaProducto: this.fb.control<number | null>(null),
        nombre: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(150)]),
        sku: this.fb.nonNullable.control('', Validators.maxLength(50)),
        descripcion: this.fb.nonNullable.control('', Validators.maxLength(500)),
        precioCompra: this.fb.control<number | null>(null, Validators.min(0)),
        precioVenta: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)])
    });

    private readonly syncDetail = effect(() => {
        const detail = this.store.detail();
        if (!detail) return;
        this.form.patchValue({
            idCategoriaProducto: detail.idCategoriaProducto,
            idMarcaProducto: detail.idMarcaProducto,
            nombre: detail.nombre,
            sku: detail.sku ?? '',
            descripcion: detail.descripcion ?? '',
            precioCompra: detail.precioCompra,
            precioVenta: detail.precioVenta
        }, { emitEvent: false });
    });

    private readonly syncSaveError = effect(() => {
        const error = this.store.saveError();
        if (!error) return;
        this.feedback.error(error); this.store.clearSaveError();
    });

    private readonly syncSaveResult = effect(() => {
        const result = this.store.saveResult();
        if (!result) return;
        const wasEditMode = this.isEditMode();
        this.store.clearSaveResult();

        if (!wasEditMode) {
            const dialogRef = this.dialog.open(ConfirmActionDialog, {
                width: '440px', disableClose: true,
                data: {
                    title: 'Producto registrado',
                    message: 'El producto se registró correctamente con stock 0. ¿Deseas registrar el stock inicial ahora?',
                    cancelText: 'Más tarde', confirmText: 'Registrar stock', icon: 'inventory_2'
                }
            });

            dialogRef.afterClosed().subscribe(registerStock => {
                if (registerStock) {
                    void this.router.navigate(['/productos', result.idProducto, 'movimiento'], { queryParams: { tipo: 'STOCK_INICIAL' } });
                    return;
                }
                void this.router.navigate(['/productos']);
            });
            return;
        }

        void this.router.navigate(['/productos', result.idProducto]).then(() => this.feedback.success(result.mensaje || 'Producto actualizado correctamente.'));
    });

    ngOnInit(): void {
        const rawId = this.route.snapshot.paramMap.get('id');
        if (rawId === null) { this.store.initialize(null); return; }
        const id = Number(rawId);
        if (!Number.isInteger(id) || id <= 0) { void this.router.navigate(['/productos']); return; }
        this.idProducto.set(id); this.store.initialize(id);
    }

    protected save(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid || this.store.saving()) return;
        const request = this.buildCreateRequest();
        const id = this.idProducto();
        if (id === null) { this.store.create(request); return; }
        const rowVersion = this.store.detail()?.rowVersion;
        if (!rowVersion) { this.feedback.warning('Recarga el producto antes de guardar los cambios.'); return; }
        this.store.update(id, { ...request, rowVersion });
    }

    protected normalizeSku(): void {
        const sku = this.form.controls.sku.value.trim().replace(/\s+/g, '').toUpperCase();
        this.form.controls.sku.setValue(sku, { emitEvent: false });
    }

    private buildCreateRequest(): ProductoCreateRequest {
        const value = this.form.getRawValue();
        return {
            idCategoriaProducto: value.idCategoriaProducto!,
            idMarcaProducto: value.idMarcaProducto,
            nombre: value.nombre.trim(),
            sku: this.nullable(value.sku.replace(/\s+/g, '').toUpperCase()),
            descripcion: this.nullable(value.descripcion),
            precioCompra: value.precioCompra,
            precioVenta: value.precioVenta!
        };
    }

    private nullable(value: string): string | null { const text = value.trim(); return text || null; }
}
