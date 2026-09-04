
import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { ConstanciaApiService } from '../../../sacramentos/constancias/data-access/constancia-api.service';
import {
    ConfiguracionConstancia,
    ConfiguracionImpresionConstancia,
    ConstanciaAlineacion,
    ConstanciaImpresoraValidacion,
    ConstanciaImpresionTrabajoEstado,
    ConstanciaPlantilla,
    ConstanciaPlantillaCampo,
    ConstanciaTipoConexion,
    ConstanciaTipoSacramento
} from '../../../sacramentos/constancias/data-access/models/constancia.models';

@Component({
    selector: 'pcr-constancia-print-settings',
    imports: [DatePipe, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule],
    templateUrl: './constancia-print-settings.html',
    styleUrl: './constancia-print-settings.scss'
})
export class ConstanciaPrintSettingsComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly api = inject(ConstanciaApiService);
    private readonly feedback = inject(FeedbackService);
    private readonly authStore = inject(AuthStore);
    private readonly dialog = inject(MatDialog);

    protected readonly loadingConfig = signal(false);
    protected readonly savingConfig = signal(false);
    protected readonly loadingPrinter = signal(false);
    protected readonly savingPrinter = signal(false);
    protected readonly validatingPrinter = signal(false);
    protected readonly printerValidation = signal<ConstanciaImpresoraValidacion | null>(null);
    protected readonly loadingPlantilla = signal(false);
    protected readonly savingPlantilla = signal(false);
    protected readonly changingCalibration = signal(false);
    protected readonly generatingTest = signal(false);
    protected readonly printingTest = signal(false);
    protected readonly testPrintStatus = signal<string | null>(null);
    protected readonly fieldsDirty = signal(false);

    protected readonly config = signal<ConfiguracionConstancia | null>(null);
    protected readonly printer = signal<ConfiguracionImpresionConstancia | null>(null);
    protected readonly plantilla = signal<ConstanciaPlantilla | null>(null);
    protected readonly campos = signal<ConstanciaPlantillaCampo[]>([]);
    protected readonly selectedTipo = signal<ConstanciaTipoSacramento>('BAUTISMO');

    protected readonly canEdit = () => this.authStore.hasPermission(PERMISSION_CODE.CONFIGURATION_EDIT);
    protected readonly canEditCalibration = () => this.canEdit() && this.plantilla()?.estaCalibrada === false;

    protected readonly tipos: readonly { value: ConstanciaTipoSacramento; label: string }[] = [
        { value: 'BAUTISMO', label: 'Bautismo' },
        { value: 'CONFIRMACION', label: 'Confirmación' },
        { value: 'MATRIMONIO', label: 'Matrimonio' }
    ];

    protected readonly conexiones: readonly { value: ConstanciaTipoConexion; label: string }[] = [
        { value: 'USB', label: 'USB / instalada localmente' },
        { value: 'RED', label: 'Red Ethernet' },
        { value: 'COMPARTIDA', label: 'Impresora compartida de Windows' }
    ];

    protected readonly alineaciones: readonly ConstanciaAlineacion[] = ['LEFT', 'CENTER', 'RIGHT'];

    protected readonly generalForm = this.fb.nonNullable.group({
        nombreParroquia: ['', [Validators.required, Validators.maxLength(250)]],
        lugarExpedicion: ['', [Validators.required, Validators.maxLength(150)]]
    });

    protected readonly printerForm = this.fb.nonNullable.group({
        tipoConexion: this.fb.nonNullable.control<ConstanciaTipoConexion>('USB'),
        nombreImpresoraWindows: ['', [Validators.required, Validators.maxLength(150)]],
        direccionIp: ['', Validators.maxLength(45)],
        puerto: [9100, [Validators.min(1), Validators.max(65535)]]
    });

    protected readonly plantillaForm = this.fb.nonNullable.group({
        anchoPapelMm: [210, [Validators.required, Validators.min(1), Validators.max(1000)]],
        altoPapelMm: [297, [Validators.required, Validators.min(1), Validators.max(1000)]],
        offsetGlobalXmm: [0, [Validators.required, Validators.min(-100), Validators.max(100)]],
        offsetGlobalYmm: [0, [Validators.required, Validators.min(-100), Validators.max(100)]]
    });

    ngOnInit(): void {
        this.loadConfig();
        this.loadPrinter();
        this.loadPlantilla();
    }

    protected tipoChanged(tipo: ConstanciaTipoSacramento): void {
        this.selectedTipo.set(tipo);
        this.loadPlantilla();
    }

    protected saveConfig(): void {
        if (!this.canEdit() || this.savingConfig()) return;
        this.generalForm.markAllAsTouched();
        if (this.generalForm.invalid) return;

        const current = this.config();
        if (!current) return;

        const value = this.generalForm.getRawValue();
        this.savingConfig.set(true);
        this.api.updateConfiguracion({
            nombreParroquia: value.nombreParroquia.trim(),
            lugarExpedicion: value.lugarExpedicion.trim(),
            rowVersion: current.rowVersion
        }).subscribe({
            next: result => {
                this.savingConfig.set(false);
                this.applyConfig(result);
                this.feedback.success('Parámetros generales de constancias actualizados.');
            },
            error: error => {
                this.savingConfig.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudieron actualizar los parámetros generales de constancias.'));
            }
        });
    }

    protected savePrinter(): void {
        if (!this.canEdit() || this.savingPrinter()) return;
        this.printerForm.markAllAsTouched();
        if (this.printerForm.invalid) return;

        const current = this.printer();
        if (!current) return;

        const value = this.printerForm.getRawValue();
        const isRed = value.tipoConexion === 'RED';
        if (isRed && (!value.direccionIp.trim() || !value.puerto)) {
            this.feedback.warning('Para una impresora de red debes indicar dirección IP y puerto.');
            return;
        }

        this.savingPrinter.set(true);
        this.api.updateImpresora({
            tipoConexion: value.tipoConexion,
            nombreImpresoraWindows: value.nombreImpresoraWindows.trim(),
            direccionIp: isRed ? value.direccionIp.trim() : null,
            puerto: isRed ? value.puerto : null,
            rowVersion: current.rowVersion
        }).subscribe({
            next: result => {
                this.savingPrinter.set(false);
                this.applyPrinter(result.configuracion);
                this.printerValidation.set(null);
                this.loadPlantilla();

                if (result.plantillasDescalibradas > 0) {
                    this.feedback.warning(`${result.mensaje} Se desmarcaron ${result.plantillasDescalibradas} plantilla(s) para volver a verificar su calibración.`);
                } else {
                    this.feedback.success(result.mensaje);
                }
            },
            error: error => {
                this.savingPrinter.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo actualizar la impresora de constancias.'));
            }
        });
    }

    protected validatePrinter(): void {
        if (this.validatingPrinter()) return;
        this.validatingPrinter.set(true);
        this.api.validarImpresora().subscribe({
            next: result => {
                this.validatingPrinter.set(false);
                this.printerValidation.set(result);
                if (result.disponible) this.feedback.success(result.mensaje);
                else this.feedback.warning(result.mensaje);
            },
            error: error => {
                this.validatingPrinter.set(false);
                this.printerValidation.set(null);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo validar la impresora de constancias.'));
            }
        });
    }

    protected savePlantilla(): void {
        if (!this.canEditCalibration() || this.savingPlantilla()) return;
        this.plantillaForm.markAllAsTouched();
        if (this.plantillaForm.invalid) return;

        const current = this.plantilla();
        if (!current) return;

        const value = this.plantillaForm.getRawValue();
        this.savingPlantilla.set(true);
        this.api.updatePlantilla(this.selectedTipo(), {
            ...value,
            estaCalibrada: false,
            campos: this.campos().map(c => ({
                codigoCampo: c.codigoCampo,
                xmm: c.xmm,
                ymm: c.ymm,
                anchoMm: c.anchoMm,
                altoMm: c.altoMm,
                tamanoFuentePt: c.tamanoFuentePt,
                alineacion: c.alineacion,
                maxLineas: c.maxLineas,
                isActive: c.isActive
            })),
            rowVersion: current.rowVersion
        }).subscribe({
            next: result => {
                this.savingPlantilla.set(false);
                this.applyPlantilla(result);
                this.feedback.success('Plantilla guardada. Continúa pendiente de marcar como calibrada.');
            },
            error: error => {
                this.savingPlantilla.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo actualizar la plantilla de constancia.'));
            }
        });
    }

    protected openCalibration(): void {
        const current = this.plantilla();
        if (!this.canEdit() || !current || !current.estaCalibrada || this.changingCalibration()) return;

        this.confirm(
            'Editar calibración',
            'La plantilla quedará temporalmente NO CALIBRADA y se bloqueará la impresión oficial hasta que vuelvas a marcarla como calibrada.',
            'Editar calibración',
            'tune'
        ).subscribe(confirmed => {
            if (!confirmed) return;
            this.changingCalibration.set(true);
            this.api.abrirCalibracion(this.selectedTipo(), { rowVersion: current.rowVersion }).subscribe({
                next: result => {
                    this.changingCalibration.set(false);
                    this.applyPlantilla(result);
                    this.feedback.warning('Calibración abierta. Ajusta los parámetros, imprime pruebas y vuelve a marcarla como calibrada.');
                },
                error: error => {
                    this.changingCalibration.set(false);
                    this.feedback.error(getApiErrorMessage(error, 'No se pudo abrir la calibración.'));
                }
            });
        });
    }

    protected markCalibrated(): void {
        if (this.hasUnsavedCalibrationChanges()) {
            this.feedback.warning('Guarda los parámetros de calibración antes de marcar la plantilla como calibrada.');
            return;
        }
        const current = this.plantilla();
        if (!this.canEdit() || !current || current.estaCalibrada || this.changingCalibration()) return;

        this.confirm(
            'Marcar plantilla como calibrada',
            'Confirma únicamente si ya realizaste una prueba física y todos los datos coinciden con el formato oficial. Después los parámetros quedarán bloqueados.',
            'Marcar calibrada',
            'verified'
        ).subscribe(confirmed => {
            if (!confirmed) return;
            this.changingCalibration.set(true);
            this.api.marcarCalibrada(this.selectedTipo(), { rowVersion: current.rowVersion }).subscribe({
                next: result => {
                    this.changingCalibration.set(false);
                    this.applyPlantilla(result);
                    this.feedback.success('Plantilla calibrada y bloqueada para edición.');
                },
                error: error => {
                    this.changingCalibration.set(false);
                    this.feedback.error(getApiErrorMessage(error, 'No se pudo marcar la plantilla como calibrada.'));
                }
            });
        });
    }

    protected viewTest(): void {
        if (this.hasUnsavedCalibrationChanges()) {
            this.feedback.warning('Guarda los parámetros antes de generar la hoja de prueba para que el PDF use los valores actuales.');
            return;
        }
        if (this.generatingTest()) return;
        const popup = window.open('', '_blank');
        this.generatingTest.set(true);
        this.api.getPruebaPdf(this.selectedTipo()).subscribe({
            next: blob => {
                this.generatingTest.set(false);
                this.openBlob(blob, popup);
            },
            error: error => {
                this.generatingTest.set(false);
                popup?.close();
                this.feedback.error(getApiErrorMessage(error, 'No se pudo generar la hoja de prueba.'));
            }
        });
    }

    protected printTest(): void {
        if (this.hasUnsavedCalibrationChanges()) {
            this.feedback.warning('Guarda los parámetros antes de imprimir la hoja de prueba para que la impresora use la calibración actual.');
            return;
        }
        if (this.printingTest()) return;
        this.printingTest.set(true);
        this.testPrintStatus.set('Enviando hoja de prueba a la impresora configurada...');
        this.api.imprimirPrueba(this.selectedTipo()).subscribe({
            next: job => {
                this.testPrintStatus.set(`Trabajo #${job.idTrabajo} · ${job.estado} · ${job.impresora}`);
                this.feedback.success(`Hoja de prueba enviada a ${job.impresora}.`);
                this.waitForPrintJob(job.idTrabajo, status => {
                    this.printingTest.set(false);
                    this.testPrintStatus.set(`Trabajo #${status.idTrabajo} · ${status.estado} · ${status.impresora}`);
                    if (status.estado === 'COMPLETADO') this.feedback.success('Hoja de prueba enviada correctamente al spooler de Windows.');
                    else this.feedback.error(status.ultimoDetalle || 'La impresión de prueba terminó con error.');
                });
            },
            error: error => {
                this.printingTest.set(false);
                this.testPrintStatus.set(null);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo imprimir la hoja de prueba.'));
            }
        });
    }

    protected setFieldNumber(id: number, property: 'xmm' | 'ymm' | 'anchoMm' | 'altoMm' | 'tamanoFuentePt' | 'maxLineas', event: Event): void {
        if (!this.canEditCalibration()) return;
        const raw = Number((event.target as HTMLInputElement).value);
        if (!Number.isFinite(raw)) return;
        this.campos.update(items => items.map(item =>
            item.idConstanciaPlantillaCampo === id
                ? { ...item, [property]: property === 'maxLineas' ? Math.trunc(raw) : raw }
                : item));
        this.fieldsDirty.set(true);
    }

    protected setFieldAlignment(id: number, event: Event): void {
        if (!this.canEditCalibration()) return;
        const value = (event.target as HTMLSelectElement).value as ConstanciaAlineacion;
        this.campos.update(items => items.map(item =>
            item.idConstanciaPlantillaCampo === id ? { ...item, alineacion: value } : item));
        this.fieldsDirty.set(true);
    }

    protected setFieldActive(id: number, event: Event): void {
        if (!this.canEditCalibration()) return;
        const value = (event.target as HTMLInputElement).checked;
        this.campos.update(items => items.map(item =>
            item.idConstanciaPlantillaCampo === id ? { ...item, isActive: value } : item));
        this.fieldsDirty.set(true);
    }

    private loadConfig(): void {
        this.loadingConfig.set(true);
        this.api.getConfiguracion().subscribe({
            next: result => {
                this.loadingConfig.set(false);
                this.applyConfig(result);
            },
            error: error => {
                this.loadingConfig.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar la configuración de constancias.'));
            }
        });
    }

    private loadPrinter(): void {
        this.loadingPrinter.set(true);
        this.api.getImpresora().subscribe({
            next: result => {
                this.loadingPrinter.set(false);
                this.applyPrinter(result);
            },
            error: error => {
                this.loadingPrinter.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar la impresora de constancias.'));
            }
        });
    }

    private loadPlantilla(): void {
        this.loadingPlantilla.set(true);
        this.api.getPlantilla(this.selectedTipo()).subscribe({
            next: result => {
                this.loadingPlantilla.set(false);
                this.applyPlantilla(result);
            },
            error: error => {
                this.loadingPlantilla.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo cargar la plantilla de constancia.'));
            }
        });
    }

    private applyConfig(result: ConfiguracionConstancia): void {
        this.config.set(result);
        this.generalForm.reset({
            nombreParroquia: result.nombreParroquia,
            lugarExpedicion: result.lugarExpedicion
        });
    }

    private applyPrinter(result: ConfiguracionImpresionConstancia): void {
        this.printer.set(result);
        this.printerForm.reset({
            tipoConexion: result.tipoConexion,
            nombreImpresoraWindows: result.nombreImpresoraWindows ?? '',
            direccionIp: result.direccionIp ?? '',
            puerto: result.puerto ?? 9100
        });
    }

    private applyPlantilla(result: ConstanciaPlantilla): void {
        this.plantilla.set(result);
        this.campos.set(result.campos.map(x => ({ ...x })));
        this.plantillaForm.reset({
            anchoPapelMm: result.anchoPapelMm,
            altoPapelMm: result.altoPapelMm,
            offsetGlobalXmm: result.offsetGlobalXmm,
            offsetGlobalYmm: result.offsetGlobalYmm
        });
        this.fieldsDirty.set(false);
        this.plantillaForm.markAsPristine();

        if (result.estaCalibrada) this.plantillaForm.disable({ emitEvent: false });
        else if (this.canEdit()) this.plantillaForm.enable({ emitEvent: false });
        else this.plantillaForm.disable({ emitEvent: false });
    }

    private confirm(title: string, message: string, confirmText: string, icon: string) {
        return this.dialog.open(ConfirmActionDialog, {
            width: 'min(520px, calc(100vw - 2rem))',
            data: { title, message, cancelText: 'Cancelar', confirmText, icon }
        }).afterClosed();
    }

    private hasUnsavedCalibrationChanges(): boolean { return this.plantillaForm.dirty || this.fieldsDirty(); }

    private waitForPrintJob(idTrabajo: number, done: (status: ConstanciaImpresionTrabajoEstado) => void, attempt = 0): void {
        this.api.getTrabajoEstado(idTrabajo).subscribe({
            next: status => {
                this.testPrintStatus.set(`Trabajo #${status.idTrabajo} · ${status.estado} · intento ${status.intentos}/${status.maxIntentos}`);
                if (status.estado === 'COMPLETADO' || status.estado === 'ERROR') { done(status); return; }
                if (attempt >= 90) {
                    this.printingTest.set(false);
                    this.feedback.warning('La impresión sigue pendiente. Puedes continuar trabajando y revisar el PCR Print Agent.');
                    return;
                }
                window.setTimeout(() => this.waitForPrintJob(idTrabajo, done, attempt + 1), 1000);
            },
            error: error => {
                this.printingTest.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo consultar el estado de impresión.'));
            }
        });
    }

    private openBlob(blob: Blob, popup: Window | null): void {
        const url = URL.createObjectURL(blob);
        if (popup) popup.location.href = url;
        else window.open(url, '_blank');
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
}
