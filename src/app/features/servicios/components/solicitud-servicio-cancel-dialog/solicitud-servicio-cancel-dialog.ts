import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SolicitudServicioAnularRequest } from '../../data-access/models/solicitud-servicio-write.models';

export interface SolicitudServicioCancelDialogData {
    readonly codSolicitudServicio: string;
    readonly rowVersion: string;
}

@Component({
    selector: 'pcr-solicitud-servicio-cancel-dialog',
    imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule],
    templateUrl: './solicitud-servicio-cancel-dialog.html',
    styleUrl: './solicitud-servicio-cancel-dialog.scss'
})
export class SolicitudServicioCancelDialog {
    protected readonly data = inject<SolicitudServicioCancelDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<SolicitudServicioCancelDialog, SolicitudServicioAnularRequest>);
    private readonly fb = inject(FormBuilder);

    protected readonly form = this.fb.group({
        motivo: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(250)])
    });

    protected confirm(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) return;
        this.dialogRef.close({ motivo: this.form.controls.motivo.value.trim(), rowVersion: this.data.rowVersion });
    }
}
