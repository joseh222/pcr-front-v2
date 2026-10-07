import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VentaCancelRequest, VentaRazonAnulacion } from '../../data-access/models/venta-cancel.models';

export interface VentaCancelDialogData {
    readonly codVenta: string;
    readonly rowVersion: string;
    readonly razones: readonly VentaRazonAnulacion[];
}

@Component({
    selector: 'pcr-venta-cancel-dialog',
    imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
    templateUrl: './venta-cancel-dialog.html',
    styleUrl: './venta-cancel-dialog.scss'
})
export class VentaCancelDialog {
    protected readonly data = inject<VentaCancelDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<VentaCancelDialog, VentaCancelRequest>);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly form = this.fb.group({
        idRazonAnulacion: this.fb.control<number | null>(null, Validators.required),
        motivoAnulacion: this.fb.control<string | null>(null, Validators.maxLength(500))
    });

    constructor() {
        this.form.controls.idRazonAnulacion.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            const control = this.form.controls.motivoAnulacion;
            control.setValidators(this.requiresDetail()
                ? [Validators.required, Validators.maxLength(500)]
                : Validators.maxLength(500)
            );
            control.updateValueAndValidity({ emitEvent: false });
        });
    }

    protected requiresDetail(): boolean {
        const id = this.form.controls.idRazonAnulacion.value;
        return this.data.razones.find(x => x.idRazonAnulacion === id)?.requiereDetalle ?? false;
    }

    protected confirm(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) return;

        const value = this.form.getRawValue();

        this.dialogRef.close({
            idRazonAnulacion: value.idRazonAnulacion!,
            motivoAnulacion: value.motivoAnulacion?.trim() || null,
            rowVersion: this.data.rowVersion
        });
    }
}