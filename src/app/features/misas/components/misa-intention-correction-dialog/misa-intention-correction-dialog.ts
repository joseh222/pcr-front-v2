import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { forkJoin } from 'rxjs';
import { MisaApiService } from '../../data-access/misa-api.service';
import { VentaDocumentoMisa } from '../../../ventas/data-access/models/venta-document.models';

export interface MisaIntentionCorrectionDialogData { readonly misas: readonly VentaDocumentoMisa[]; }
interface DraftIntention { idIntencion: number; nombre: string; observacion: string; }
interface DraftMisa { idMisa: number; codMisa: string; modalidad: string | null; tipo: string | null; intenciones: DraftIntention[]; }

@Component({
    selector: 'pcr-misa-intention-correction-dialog',
    imports: [FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule],
    templateUrl: './misa-intention-correction-dialog.html',
    styleUrl: './misa-intention-correction-dialog.scss'
})
export class MisaIntentionCorrectionDialog {
    private readonly data = inject<MisaIntentionCorrectionDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<MisaIntentionCorrectionDialog, boolean>);
    private readonly api = inject(MisaApiService);
    protected readonly saving = signal(false);
    protected readonly error = signal<string | null>(null);
    protected readonly misas: DraftMisa[] = this.data.misas.map(m => ({ idMisa: m.idMisa, codMisa: m.codMisa, modalidad: m.modalidad, tipo: m.tipo, intenciones: m.intenciones.map(i => ({ idIntencion: i.idIntencion, nombre: i.nombre, observacion: i.observacion ?? '' })) }));

    protected save(): void {
        if (this.saving()) return;
        const invalid = this.misas.some(m => m.intenciones.some(i => !i.nombre.trim() || i.nombre.trim().length > 100 || i.observacion.trim().length > 200));
        if (invalid) { this.error.set('Revisa los nombres y observaciones. El nombre es obligatorio (máx. 100) y la observación admite hasta 200 caracteres.'); return; }
        const calls = this.misas.filter(m => m.intenciones.length > 0).map(m => this.api.correctIntenciones(m.idMisa, { intenciones: m.intenciones.map(i => ({ idIntencion: i.idIntencion, nombre: i.nombre.trim(), observacion: i.observacion.trim() || null })) }));
        if (calls.length === 0) { this.dialogRef.close(false); return; }
        this.saving.set(true); this.error.set(null);
        forkJoin(calls).subscribe({ next: () => { this.saving.set(false); this.dialogRef.close(true); }, error: error => { this.saving.set(false); this.error.set(error?.error?.messages?.[0] ?? error?.error?.message ?? 'No se pudieron corregir las intenciones.'); } });
    }
}
