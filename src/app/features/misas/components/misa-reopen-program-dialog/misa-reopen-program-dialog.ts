import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface MisaReopenProgramDialogData {
    readonly fechaLabel: string;
    readonly hora: string;
    readonly versionActual: number;
}

@Component({
    selector: 'pcr-misa-reopen-program-dialog',
    imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule],
    templateUrl: './misa-reopen-program-dialog.html',
    styleUrl: './misa-reopen-program-dialog.scss'
})
export class MisaReopenProgramDialog {
    protected readonly data = inject<MisaReopenProgramDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<MisaReopenProgramDialog, string>);
    private readonly fb = inject(FormBuilder);

    protected readonly form = this.fb.group({
        motivo: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(250)])
    });

    protected confirm(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid) return;

        const motivo = this.form.controls.motivo.value.trim();
        if (!motivo) return;

        this.dialogRef.close(motivo);
    }
}
