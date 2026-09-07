import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { SacramentalTextCaseService } from '../../../sacramentos/shared/sacramental-text-case.service';
import { ConfiguracionApiService } from '../../data-access/configuracion-api.service';
import {
    ConfiguracionColaImpresion,
    ConfiguracionImpresion,
    ImpresionColaResumen,
    ModoImpresion,
    TipoConexionImpresora
} from '../../data-access/models/configuracion-impresion.models';
import { ConfiguracionSacramental } from '../../data-access/models/configuracion-sacramental.models';
import { ConstanciaPrintSettingsComponent } from '../../components/constancia-print-settings/constancia-print-settings';

@Component({
    selector: 'pcr-configuracion-impresion',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSlideToggleModule,
        ConstanciaPrintSettingsComponent
    ],
    templateUrl: './configuracion-impresion.html',
    styleUrl: './configuracion-impresion.scss'
})
export class ConfiguracionImpresionPage implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly api = inject(ConfiguracionApiService);
    private readonly feedback = inject(FeedbackService);
    private readonly authStore = inject(AuthStore);
    private readonly sacramentalText = inject(SacramentalTextCaseService);
    private readonly dialog = inject(MatDialog);

    protected readonly loadingCola = signal(false);
    protected readonly savingCola = signal(false);
    protected readonly cancellingCola = signal(false);
    protected readonly configCola = signal<ConfiguracionColaImpresion | null>(null);
    protected readonly resumenCola = signal<ImpresionColaResumen | null>(null);

    protected readonly loadingImpresion = signal(false);
    protected readonly savingImpresion = signal(false);
    protected readonly configImpresion = signal<ConfiguracionImpresion | null>(null);

    protected readonly loadingSacramental = signal(false);
    protected readonly savingSacramental = signal(false);
    protected readonly configSacramental = signal<ConfiguracionSacramental | null>(null);

    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.CONFIGURATION_EDIT);
    protected readonly canViewQueue = () => this.authStore.hasPermission(PERMISSION_CODE.PRINT_QUEUE_VIEW);
    protected readonly canEditQueue = () => this.authStore.hasPermission(PERMISSION_CODE.PRINT_QUEUE_EDIT);
    protected readonly canCancelQueue = () => this.authStore.hasPermission(PERMISSION_CODE.PRINT_QUEUE_CANCEL);

    protected readonly modos: readonly { value: ModoImpresion; label: string }[] = [
        { value: 'MANUAL', label: 'Manual' },
        { value: 'AUTOMATICO', label: 'Automático' }
    ];

    protected readonly conexiones: readonly { value: TipoConexionImpresora; label: string }[] = [
        { value: 'RED', label: 'Red Ethernet' },
        { value: 'USB', label: 'USB' },
        { value: 'COMPARTIDA', label: 'Impresora compartida' }
    ];

    protected readonly colaForm = this.fb.nonNullable.group({
        colaHabilitada: false,
        maxAntiguedadAutomaticaMinutos: [10, [Validators.required, Validators.min(1), Validators.max(1440)]],
        maxAntiguedadManualMinutos: [60, [Validators.required, Validators.min(1), Validators.max(10080)]]
    });

    protected readonly impresionForm = this.fb.nonNullable.group({
        modo: this.fb.nonNullable.control<ModoImpresion>('MANUAL'),
        tipoConexion: this.fb.nonNullable.control<TipoConexionImpresora>('RED'),
        nombreImpresoraWindows: ['', [Validators.required, Validators.maxLength(150)]],
        direccionIp: ['', Validators.maxLength(45)],
        puerto: [9100, [Validators.min(1), Validators.max(65535)]],
        anchoPapelMm: [80, Validators.required],
        imprimirTicketVenta: true,
        imprimirDocumentosAsociados: true,
        cortarEntreDocumentos: true,
        isActive: true
    });

    protected readonly sacramentalForm = this.fb.nonNullable.group({ forzarMayusculas: true });

    ngOnInit(): void {
        if (this.canViewQueue()) this.loadCola();
        this.loadImpresion();
        this.loadSacramental();
    }

    protected saveCola(): void {
        if (!this.canEditQueue() || this.savingCola()) return;
        this.colaForm.markAllAsTouched();
        if (this.colaForm.invalid) return;
        const current = this.configCola();
        if (!current) return;
        const value = this.colaForm.getRawValue();
        this.savingCola.set(true);
        this.api.updateColaImpresion({ ...value, rowVersion: current.rowVersion }).subscribe({
            next: result => {
                this.savingCola.set(false);
                this.applyCola(result);
                this.loadResumenCola();
                this.feedback.success(result.colaHabilitada ? 'Cola de impresión habilitada.' : 'Cola de impresión pausada.');
            },
            error: error => {
                this.savingCola.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo actualizar la seguridad de la cola.'));
            }
        });
    }

    protected refreshCola(): void {
        if (!this.canViewQueue()) return;
        this.loadCola();
    }

    protected cancelarPendientes(): void {
        if (!this.canCancelQueue() || this.cancellingCola()) return;
        const pendientes = this.resumenCola()?.pendientes ?? 0;
        if (pendientes <= 0) {
            this.feedback.warning('No hay trabajos pendientes para cancelar.');
            return;
        }

        this.dialog.open(ConfirmActionDialog, {
            width: 'min(560px, calc(100vw - 2rem))',
            data: {
                title: 'Cancelar trabajos pendientes',
                message: `Se cancelarán ${pendientes} trabajo(s) PENDIENTE. Los trabajos que ya estén PROCESANDO no se interrumpirán. Esta acción evita que se impriman al reanudar el agente.`,
                cancelText: 'Volver',
                confirmText: 'Cancelar pendientes',
                icon: 'delete_sweep'
            }
        }).afterClosed().subscribe(ok => {
            if (!ok) return;
            this.cancellingCola.set(true);
            this.api.cancelarPendientesColaImpresion().subscribe({
                next: result => {
                    this.cancellingCola.set(false);
                    this.feedback.success(result.mensaje);
                    this.loadResumenCola();
                },
                error: error => {
                    this.cancellingCola.set(false);
                    this.feedback.error(getApiErrorMessage(error, 'No se pudieron cancelar los trabajos pendientes.'));
                }
            });
        });
    }

    protected saveImpresion(): void {
        if (!this.canEdit() || this.savingImpresion()) return;
        this.impresionForm.markAllAsTouched();
        if (this.impresionForm.invalid) return;
        const current = this.configImpresion();
        if (!current) return;
        const value = this.impresionForm.getRawValue();
        this.savingImpresion.set(true);
        this.api.updateImpresion({
            ...value,
            direccionIp: value.direccionIp.trim() || null,
            nombreImpresoraWindows: value.nombreImpresoraWindows.trim(),
            puerto: value.puerto || null,
            rowVersion: current.rowVersion
        }).subscribe({
            next: result => {
                this.savingImpresion.set(false);
                this.applyImpresion(result);
                this.feedback.success('Configuración de impresión actualizada.');
            },
            error: error => {
                this.savingImpresion.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo actualizar la configuración de impresión.'));
            }
        });
    }

    protected saveSacramental(): void {
        if (!this.canEdit() || this.savingSacramental()) return;
        const current = this.configSacramental();
        if (!current) return;
        this.savingSacramental.set(true);
        this.api.updateSacramental({
            forzarMayusculas: this.sacramentalForm.controls.forzarMayusculas.value,
            rowVersion: current.rowVersion
        }).subscribe({
            next: result => {
                this.savingSacramental.set(false);
                this.applySacramental(result);
                this.feedback.success('Configuración de registros sacramentales actualizada.');
            },
            error: error => {
                this.savingSacramental.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo actualizar la configuración de registros sacramentales.'));
            }
        });
    }

    private loadCola(): void {
        this.loadingCola.set(true);
        this.api.getColaImpresion().subscribe({
            next: result => {
                this.applyCola(result);
                this.loadResumenCola();
            },
            error: error => {
                this.loadingCola.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar la seguridad de la cola de impresión.'));
            }
        });
    }

    private loadResumenCola(): void {
        this.api.getResumenColaImpresion().subscribe({
            next: result => {
                this.resumenCola.set(result);
                this.loadingCola.set(false);
            },
            error: error => {
                this.loadingCola.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo consultar el estado de la cola de impresión.'));
            }
        });
    }

    private loadImpresion(): void {
        this.loadingImpresion.set(true);
        this.api.getImpresion().subscribe({
            next: result => {
                this.loadingImpresion.set(false);
                this.applyImpresion(result);
            },
            error: error => {
                this.loadingImpresion.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar la configuración de impresión.'));
            }
        });
    }

    private loadSacramental(): void {
        this.loadingSacramental.set(true);
        this.api.getSacramental().subscribe({
            next: result => {
                this.loadingSacramental.set(false);
                this.applySacramental(result);
            },
            error: error => {
                this.loadingSacramental.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar la configuración de registros sacramentales.'));
            }
        });
    }

    private applyCola(result: ConfiguracionColaImpresion): void {
        this.configCola.set(result);
        this.colaForm.reset({
            colaHabilitada: result.colaHabilitada,
            maxAntiguedadAutomaticaMinutos: result.maxAntiguedadAutomaticaMinutos,
            maxAntiguedadManualMinutos: result.maxAntiguedadManualMinutos
        });
    }

    private applyImpresion(result: ConfiguracionImpresion): void {
        this.configImpresion.set(result);
        this.impresionForm.reset({
            modo: result.modo,
            tipoConexion: result.tipoConexion,
            nombreImpresoraWindows: result.nombreImpresoraWindows,
            direccionIp: result.direccionIp ?? '',
            puerto: result.puerto ?? 9100,
            anchoPapelMm: result.anchoPapelMm,
            imprimirTicketVenta: result.imprimirTicketVenta,
            imprimirDocumentosAsociados: result.imprimirDocumentosAsociados,
            cortarEntreDocumentos: result.cortarEntreDocumentos,
            isActive: result.isActive
        });
    }

    private applySacramental(result: ConfiguracionSacramental): void {
        this.configSacramental.set(result);
        this.sacramentalForm.reset({ forzarMayusculas: result.forzarMayusculas });
        this.sacramentalText.setForzarMayusculas(result.forzarMayusculas);
    }
}
