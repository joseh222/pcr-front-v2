import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { ConfiguracionApiService } from '../../data-access/configuracion-api.service';
import { ConfiguracionImpresion, ModoImpresion, TipoConexionImpresora } from '../../data-access/models/configuracion-impresion.models';

@Component({
    selector: 'pcr-configuracion-impresion',
    imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatSlideToggleModule],
    templateUrl: './configuracion-impresion.html', styleUrl: './configuracion-impresion.scss'
})
export class ConfiguracionImpresionPage implements OnInit {
    private readonly fb = inject(FormBuilder); private readonly api = inject(ConfiguracionApiService); private readonly feedback = inject(FeedbackService); private readonly authStore = inject(AuthStore);
    protected readonly loading = signal(false); protected readonly saving = signal(false); protected readonly config = signal<ConfiguracionImpresion | null>(null);
    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.CONFIGURATION_EDIT);
    protected readonly modos: readonly { value: ModoImpresion; label: string }[] = [{ value: 'MANUAL', label: 'Manual' }, { value: 'AUTOMATICO', label: 'Automático' }];
    protected readonly conexiones: readonly { value: TipoConexionImpresora; label: string }[] = [{ value: 'RED', label: 'Red Ethernet' }, { value: 'USB', label: 'USB' }, { value: 'COMPARTIDA', label: 'Impresora compartida' }];
    protected readonly form = this.fb.nonNullable.group({ modo: this.fb.nonNullable.control<ModoImpresion>('MANUAL'), tipoConexion: this.fb.nonNullable.control<TipoConexionImpresora>('RED'), nombreImpresoraWindows: ['', [Validators.required, Validators.maxLength(150)]], direccionIp: ['', Validators.maxLength(45)], puerto: [9100, [Validators.min(1), Validators.max(65535)]], anchoPapelMm: [80, Validators.required], imprimirTicketVenta: true, imprimirDocumentosAsociados: true, cortarEntreDocumentos: true, isActive: true });

    ngOnInit(): void { this.load(); }
    protected save(): void {
        if (!this.canEdit() || this.saving()) return; this.form.markAllAsTouched(); if (this.form.invalid) return; const current = this.config(); if (!current) return;
        const value = this.form.getRawValue(); this.saving.set(true);
        this.api.updateImpresion({ ...value, direccionIp: value.direccionIp.trim() || null, nombreImpresoraWindows: value.nombreImpresoraWindows.trim(), puerto: value.puerto || null, rowVersion: current.rowVersion }).subscribe({ next: result => { this.saving.set(false); this.apply(result); this.feedback.success('Configuración de impresión actualizada.'); }, error: error => { this.saving.set(false); this.feedback.error(getApiErrorMessage(error, 'No se pudo actualizar la configuración de impresión.')); } });
    }
    private load(): void { this.loading.set(true); this.api.getImpresion().subscribe({ next: result => { this.loading.set(false); this.apply(result); }, error: error => { this.loading.set(false); this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar la configuración de impresión.')); } }); }
    private apply(result: ConfiguracionImpresion): void { this.config.set(result); this.form.reset({ modo: result.modo, tipoConexion: result.tipoConexion, nombreImpresoraWindows: result.nombreImpresoraWindows, direccionIp: result.direccionIp ?? '', puerto: result.puerto ?? 9100, anchoPapelMm: result.anchoPapelMm, imprimirTicketVenta: result.imprimirTicketVenta, imprimirDocumentosAsociados: result.imprimirDocumentosAsociados, cortarEntreDocumentos: result.cortarEntreDocumentos, isActive: result.isActive }); }
}
