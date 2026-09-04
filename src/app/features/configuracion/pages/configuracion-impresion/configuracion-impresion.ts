import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { SacramentalTextCaseService } from '../../../sacramentos/shared/sacramental-text-case.service';
import { ConfiguracionApiService } from '../../data-access/configuracion-api.service';
import { ConfiguracionImpresion, ModoImpresion, TipoConexionImpresora } from '../../data-access/models/configuracion-impresion.models';
import { ConfiguracionSacramental } from '../../data-access/models/configuracion-sacramental.models';
import { ConstanciaPrintSettingsComponent } from '../../components/constancia-print-settings/constancia-print-settings';

@Component({ selector: 'pcr-configuracion-impresion', imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatSlideToggleModule, ConstanciaPrintSettingsComponent], templateUrl: './configuracion-impresion.html', styleUrl: './configuracion-impresion.scss' })
export class ConfiguracionImpresionPage implements OnInit {
    private readonly fb = inject(FormBuilder); private readonly api = inject(ConfiguracionApiService); private readonly feedback = inject(FeedbackService); private readonly authStore = inject(AuthStore); private readonly sacramentalText = inject(SacramentalTextCaseService);
    protected readonly loadingImpresion = signal(false); protected readonly savingImpresion = signal(false); protected readonly configImpresion = signal<ConfiguracionImpresion | null>(null);
    protected readonly loadingSacramental = signal(false); protected readonly savingSacramental = signal(false); protected readonly configSacramental = signal<ConfiguracionSacramental | null>(null);
    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.CONFIGURATION_EDIT);
    protected readonly modos: readonly { value: ModoImpresion; label: string }[] = [{ value: 'MANUAL', label: 'Manual' }, { value: 'AUTOMATICO', label: 'Automático' }];
    protected readonly conexiones: readonly { value: TipoConexionImpresora; label: string }[] = [{ value: 'RED', label: 'Red Ethernet' }, { value: 'USB', label: 'USB' }, { value: 'COMPARTIDA', label: 'Impresora compartida' }];
    protected readonly impresionForm = this.fb.nonNullable.group({ modo: this.fb.nonNullable.control<ModoImpresion>('MANUAL'), tipoConexion: this.fb.nonNullable.control<TipoConexionImpresora>('RED'), nombreImpresoraWindows: ['', [Validators.required, Validators.maxLength(150)]], direccionIp: ['', Validators.maxLength(45)], puerto: [9100, [Validators.min(1), Validators.max(65535)]], anchoPapelMm: [80, Validators.required], imprimirTicketVenta: true, imprimirDocumentosAsociados: true, cortarEntreDocumentos: true, isActive: true });
    protected readonly sacramentalForm = this.fb.nonNullable.group({ forzarMayusculas: true });

    ngOnInit(): void { this.loadImpresion(); this.loadSacramental(); }

    protected saveImpresion(): void {
        if (!this.canEdit() || this.savingImpresion()) return; this.impresionForm.markAllAsTouched(); if (this.impresionForm.invalid) return; const current = this.configImpresion(); if (!current) return;
        const value = this.impresionForm.getRawValue(); this.savingImpresion.set(true);
        this.api.updateImpresion({ ...value, direccionIp: value.direccionIp.trim() || null, nombreImpresoraWindows: value.nombreImpresoraWindows.trim(), puerto: value.puerto || null, rowVersion: current.rowVersion }).subscribe({ next: result => { this.savingImpresion.set(false); this.applyImpresion(result); this.feedback.success('Configuración de impresión actualizada.'); }, error: error => { this.savingImpresion.set(false); this.feedback.error(getApiErrorMessage(error, 'No se pudo actualizar la configuración de impresión.')); } });
    }

    protected saveSacramental(): void {
        if (!this.canEdit() || this.savingSacramental()) return; const current = this.configSacramental(); if (!current) return; this.savingSacramental.set(true);
        this.api.updateSacramental({ forzarMayusculas: this.sacramentalForm.controls.forzarMayusculas.value, rowVersion: current.rowVersion }).subscribe({ next: result => { this.savingSacramental.set(false); this.applySacramental(result); this.feedback.success('Configuración de registros sacramentales actualizada.'); }, error: error => { this.savingSacramental.set(false); this.feedback.error(getApiErrorMessage(error, 'No se pudo actualizar la configuración de registros sacramentales.')); } });
    }

    private loadImpresion(): void { this.loadingImpresion.set(true); this.api.getImpresion().subscribe({ next: result => { this.loadingImpresion.set(false); this.applyImpresion(result); }, error: error => { this.loadingImpresion.set(false); this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar la configuración de impresión.')); } }); }
    private loadSacramental(): void { this.loadingSacramental.set(true); this.api.getSacramental().subscribe({ next: result => { this.loadingSacramental.set(false); this.applySacramental(result); }, error: error => { this.loadingSacramental.set(false); this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar la configuración de registros sacramentales.')); } }); }
    private applyImpresion(result: ConfiguracionImpresion): void { this.configImpresion.set(result); this.impresionForm.reset({ modo: result.modo, tipoConexion: result.tipoConexion, nombreImpresoraWindows: result.nombreImpresoraWindows, direccionIp: result.direccionIp ?? '', puerto: result.puerto ?? 9100, anchoPapelMm: result.anchoPapelMm, imprimirTicketVenta: result.imprimirTicketVenta, imprimirDocumentosAsociados: result.imprimirDocumentosAsociados, cortarEntreDocumentos: result.cortarEntreDocumentos, isActive: result.isActive }); }
    private applySacramental(result: ConfiguracionSacramental): void { this.configSacramental.set(result); this.sacramentalForm.reset({ forzarMayusculas: result.forzarMayusculas }); this.sacramentalText.setForzarMayusculas(result.forzarMayusculas); }
}
