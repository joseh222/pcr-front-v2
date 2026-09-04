import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { ConstanciaApiService } from '../../../sacramentos/constancias/data-access/constancia-api.service';
import { ConstanciaImpresionTrabajoEstado, ConstanciaSacramental } from '../../../sacramentos/constancias/data-access/models/constancia.models';
import { SolicitudServicioCancellationService } from '../../data-access/solicitud-servicio-cancellation.service';
import { SolicitudServicioDetailStore } from '../../data-access/models/solicitud-servicio-detail.store';
import { canCancelSolicitud, canChargeSolicitud, canEditSolicitud, isMisaSolicitud } from '../../data-access/models/solicitud-servicio.rules';

@Component({
    selector: 'pcr-solicitud-servicio-detail',
    imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule],
    providers: [SolicitudServicioDetailStore],
    templateUrl: './solicitud-servicio-detail.html',
    styleUrl: './solicitud-servicio-detail.scss'
})
export class SolicitudServicioDetailPage implements OnInit {
    protected readonly store = inject(SolicitudServicioDetailStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly cancellation = inject(SolicitudServicioCancellationService);
    private readonly authStore = inject(AuthStore);
    private readonly constanciaApi = inject(ConstanciaApiService);
    private readonly feedback = inject(FeedbackService);
    private readonly dialog = inject(MatDialog);
    private idSolicitudServicio = 0;
    private quantityInitialized = false;

    protected readonly constancia = signal<ConstanciaSacramental | null>(null);
    protected readonly loadingConstancia = signal(false);
    protected readonly printingConstancia = signal(false);
    protected readonly printJobStatus = signal<ConstanciaImpresionTrabajoEstado | null>(null);
    protected readonly printQuantity = new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(1000)] });

    private readonly detailEffect = effect(() => {
        const item = this.store.detail();
        if (!item || this.quantityInitialized) return;
        this.printQuantity.setValue(Math.max(1, Number(item.cantidad) || 1));
        this.quantityInitialized = true;
    });

    ngOnInit(): void {
        this.idSolicitudServicio = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isInteger(this.idSolicitudServicio) || this.idSolicitudServicio <= 0) { void this.router.navigate(['/servicios']); return; }
        this.store.load(this.idSolicitudServicio);
        this.loadConstancia();
    }

    protected isMisa(): boolean { const item = this.store.detail(); return !!item && isMisaSolicitud(item); }
    protected canEdit(): boolean { const item = this.store.detail(); return !!item && this.authStore.hasPermission(PERMISSION_CODE.SERVICE_REQUEST_EDIT) && canEditSolicitud(item); }
    protected canCancel(): boolean { const item = this.store.detail(); return !!item && this.authStore.hasPermission(PERMISSION_CODE.SERVICE_REQUEST_CANCEL) && canCancelSolicitud(item); }
    protected canCharge(): boolean { const item = this.store.detail(); return !!item && this.authStore.hasPermission(PERMISSION_CODE.SALE_CREATE) && canChargeSolicitud(item); }
    protected canPrintConstancia(): boolean {
        const item = this.store.detail();
        return !!item && this.authStore.hasPermission(PERMISSION_CODE.SERVICE_REQUEST_VIEW) && item.estadoSolicitud === 'ACTIVA' && item.estadoPago === 'PAGADO' && item.requiereRegistroSacramental && item.tieneRegistroSacramental;
    }

    protected canReviewRegistro(): boolean {
        const item = this.store.detail();
        if (!item?.idRegistroSacramental || !item.codigoTipoSacramentoRegistro) return false;
        return item.codigoTipoSacramentoRegistro === 'BAUTISMO' ? this.authStore.hasPermission(PERMISSION_CODE.BAPTISM_VIEW)
            : item.codigoTipoSacramentoRegistro === 'CONFIRMACION' ? this.authStore.hasPermission(PERMISSION_CODE.CONFIRMATION_VIEW)
            : item.codigoTipoSacramentoRegistro === 'MATRIMONIO' ? this.authStore.hasPermission(PERMISSION_CODE.MARRIAGE_VIEW)
            : false;
    }

    protected registroDetailLink(): (string | number)[] | null {
        const item = this.store.detail();
        if (!item?.idRegistroSacramental || !item.codigoTipoSacramentoRegistro) return null;
        const base = item.codigoTipoSacramentoRegistro === 'BAUTISMO' ? '/sacramentos/bautismos'
            : item.codigoTipoSacramentoRegistro === 'CONFIRMACION' ? '/sacramentos/confirmaciones'
            : item.codigoTipoSacramentoRegistro === 'MATRIMONIO' ? '/sacramentos/matrimonios'
            : null;
        return base ? [base, item.idRegistroSacramental] : null;
    }

    protected cancel(): void {
        const item = this.store.detail();
        if (!item || !this.canCancel()) return;
        this.cancellation.cancel(item).subscribe(result => { if (result) this.store.load(this.idSolicitudServicio); });
    }

    protected imprimirConstancia(): void {
        if (!this.canPrintConstancia() || this.printingConstancia()) return;
        this.printQuantity.markAsTouched();
        if (this.printQuantity.invalid) return;

        const cantidad = this.printQuantity.value;
        this.dialog.open(ConfirmActionDialog, {
            width: 'min(540px, calc(100vw - 2rem))',
            data: {
                title: 'Imprimir constancia',
                message: `Confirma que revisaste los datos y colocaste el formato oficial en la impresora. Se enviarán ${cantidad} ejemplar(es) directamente a la impresora de constancias configurada.`,
                cancelText: 'Cancelar',
                confirmText: 'Imprimir',
                icon: 'print'
            }
        }).afterClosed().subscribe(confirmed => {
            if (!confirmed) return;
            this.printingConstancia.set(true);
            this.printJobStatus.set(null);
            this.constanciaApi.imprimir(this.idSolicitudServicio, cantidad).subscribe({
                next: job => {
                    this.feedback.success(`Trabajo #${job.idTrabajo} enviado a ${job.impresora}.`);
                    this.waitForPrintJob(job.idTrabajo);
                },
                error: error => {
                    this.printingConstancia.set(false);
                    this.feedback.error(getApiErrorMessage(error, 'No se pudo enviar la constancia a la impresora.'));
                }
            });
        });
    }

    private waitForPrintJob(idTrabajo: number, attempt = 0): void {
        this.constanciaApi.getTrabajoEstado(idTrabajo).subscribe({
            next: status => {
                this.printJobStatus.set(status);
                if (status.estado === 'COMPLETADO') {
                    this.printingConstancia.set(false);
                    this.feedback.success(`Impresión confirmada: ${status.cantidadCopias} ejemplar(es) enviados a ${status.impresora}.`);
                    this.loadConstancia();
                    this.printQuantity.setValue(1);
                    return;
                }
                if (status.estado === 'ERROR') {
                    this.printingConstancia.set(false);
                    this.feedback.error(status.ultimoDetalle || 'La impresión terminó con error.');
                    this.loadConstancia();
                    return;
                }
                if (attempt >= 90) {
                    this.printingConstancia.set(false);
                    this.feedback.warning('La impresión continúa pendiente. Revisa el PCR Print Agent o vuelve a consultar la solicitud en unos instantes.');
                    return;
                }
                window.setTimeout(() => this.waitForPrintJob(idTrabajo, attempt + 1), 1000);
            },
            error: error => {
                this.printingConstancia.set(false);
                this.feedback.error(getApiErrorMessage(error, 'No se pudo consultar el estado de la impresión.'));
            }
        });
    }

    private loadConstancia(): void {
        if (this.idSolicitudServicio <= 0) return;
        this.loadingConstancia.set(true);
        this.constanciaApi.getBySolicitud(this.idSolicitudServicio).subscribe({
            next: result => { this.loadingConstancia.set(false); this.constancia.set(result); },
            error: () => { this.loadingConstancia.set(false); this.constancia.set(null); }
        });
    }
}
