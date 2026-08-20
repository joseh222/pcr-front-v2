import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmActionDialogData {
    readonly title: string;
    readonly message: string;
    readonly cancelText: string;
    readonly confirmText: string;
    readonly icon?: string;
}

@Component({
    selector: 'pcr-confirm-action-dialog',
    imports: [MatButtonModule, MatDialogModule, MatIconModule],
    template: `
        <h2 mat-dialog-title class="dialog-title">
            <mat-icon>{{ data.icon || 'check_circle' }}</mat-icon>
            <span>{{ data.title }}</span>
        </h2>
        <mat-dialog-content><p>{{ data.message }}</p></mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-stroked-button [mat-dialog-close]="false">{{ data.cancelText }}</button>
            <button mat-flat-button [mat-dialog-close]="true">{{ data.confirmText }}</button>
        </mat-dialog-actions>
    `,
    styles: [`
        .dialog-title { display: flex; align-items: center; gap: .65rem; }
        .dialog-title mat-icon { color: var(--mat-sys-primary); }
        mat-dialog-content p { margin: .25rem 0; line-height: 1.5; max-width: 420px; }
    `]
})
export class ConfirmActionDialog {
    protected readonly data = inject<ConfirmActionDialogData>(MAT_DIALOG_DATA);
}
