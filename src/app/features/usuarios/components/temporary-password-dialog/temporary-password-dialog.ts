import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface TemporaryPasswordDialogData { readonly title: string; readonly username: string; readonly temporaryPassword: string; readonly message?: string; }

@Component({
    selector: 'pcr-temporary-password-dialog',
    imports: [MatButtonModule, MatDialogModule, MatIconModule],
    template: `
        <h2 mat-dialog-title class="dialog-title"><mat-icon>key</mat-icon><span>{{ data.title }}</span></h2>
        <mat-dialog-content>
            <p>{{ data.message || 'Entrega esta contraseña temporal al usuario por un medio seguro.' }}</p>
            <div class="credential"><span>Usuario</span><strong>{{ data.username }}</strong></div>
            <div class="credential"><span>Contraseña temporal</span><code>{{ data.temporaryPassword }}</code></div>
            <p class="warning"><mat-icon>warning_amber</mat-icon><span>Esta contraseña se muestra ahora para que puedas entregarla. El usuario deberá cambiarla al iniciar sesión.</span></p>
        </mat-dialog-content>
        <mat-dialog-actions align="end"><button mat-flat-button mat-dialog-close>Entendido</button></mat-dialog-actions>
    `,
    styles: [`
        .dialog-title,.warning{display:flex;align-items:center;gap:.6rem}.dialog-title mat-icon{color:var(--mat-sys-primary)}mat-dialog-content{display:grid;gap:.8rem;min-width:min(26rem,70vw)}mat-dialog-content>p{margin:0;line-height:1.45}.credential{display:grid;gap:.2rem;padding:.75rem;border:1px solid var(--mat-sys-outline-variant);border-radius:.75rem;background:var(--mat-sys-surface-container-low)}.credential span{font-size:.72rem;opacity:.7}.credential strong,.credential code{font-size:1rem;overflow-wrap:anywhere}.warning{font-size:.8rem;color:var(--mat-sys-on-surface-variant)}.warning mat-icon{flex:0 0 auto}@media(max-width:600px){mat-dialog-content{min-width:0}}
    `]
})
export class TemporaryPasswordDialog { protected readonly data = inject<TemporaryPasswordDialogData>(MAT_DIALOG_DATA); }
