import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompraCancelRequest } from '../../data-access/models/compra-cancel.models';

export interface CompraCancelDialogData {
    readonly codCompra: string;
    readonly rowVersion: string;
}

@Component({
    selector: 'pcr-compra-cancel-dialog',
    imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule],
    templateUrl: './compra-cancel-dialog.html',
    styleUrl: './compra-cancel-dialog.scss'
})
export class CompraCancelDialog {
    protected readonly data = inject<CompraCancelDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<CompraCancelDialog, CompraCancelRequest>);
    private readonly fb = inject(FormBuilder);

    protected readonly form = this.fb.group({ motivoAnulacion: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(250)]) });

    protected confirm(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) return;
        const motivo = this.form.controls.motivoAnulacion.value.trim();
        if (!motivo) { this.form.controls.motivoAnulacion.setErrors({ required: true }); return; }
        this.dialogRef.close({ motivoAnulacion: motivo, rowVersion: this.data.rowVersion });
    }
}
