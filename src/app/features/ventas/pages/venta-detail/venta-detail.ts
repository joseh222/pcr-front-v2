import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VentaCancellationService } from '../../data-access/venta-cancellation.service';
import { VentaApiService } from '../../data-access/venta-api.service';
import { VentaDetailStore } from '../../data-access/models/venta-detail.store';
import { VentaDetailItem } from '../../data-access/models/venta-read.models';
import { VentaDocumentoItem, VentaDocumentosResponse, VentaImpresionModoResponse } from '../../data-access/models/venta-document.models';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { MisaIntentionCorrectionDialog } from '../../../misas/components/misa-intention-correction-dialog/misa-intention-correction-dialog';

@Component({
    selector: 'pcr-venta-detail',
    imports: [CurrencyPipe, DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule, MatSnackBarModule, MatDialogModule],
    providers: [VentaDetailStore],
    templateUrl: './venta-detail.html',
    styleUrl: './venta-detail.scss'
})
export class VentaDetailPage implements OnInit {
    protected readonly store = inject(VentaDetailStore);
    private readonly route = inject(ActivatedRoute);
    private readonly cancellation = inject(VentaCancellationService);
    private readonly authStore = inject(AuthStore);
    private readonly api = inject(VentaApiService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly dialog = inject(MatDialog);
    protected readonly generatingTicket = signal(false);
    protected readonly generatingDocuments = signal(false);
    protected readonly documents = signal<VentaDocumentosResponse | null>(null);
    protected readonly printMode = signal<VentaImpresionModoResponse>({ modo: 'MANUAL', isActive: true });
    private idVenta = 0;

    ngOnInit(): void {
        this.idVenta = Number(this.route.snapshot.paramMap.get('id'));
        if (Number.isInteger(this.idVenta) && this.idVenta > 0) { this.store.load(this.idVenta); this.loadDocuments(); this.loadPrintMode(); }
    }

    protected canCancel(): boolean { const venta = this.store.detail(); return !!venta && this.authStore.hasPermission(PERMISSION_CODE.SALE_CANCEL) && venta.puedeAnular; }
    protected canCorrectMisa(): boolean { return this.authStore.hasPermission(PERMISSION_CODE.MASS_EDIT); }

    protected cancel(): void {
        const venta = this.store.detail();
        if (!venta || !this.canCancel()) return;

        this.cancellation.cancel(venta).subscribe(result => {
            if (result) this.store.load(this.idVenta);
        });
    }

    protected openTicket(): void {
        if (this.generatingTicket() || this.idVenta <= 0) return;
        this.generatingTicket.set(true);
        this.openPdf(this.api.getTicket(this.idVenta), `Ticket_Venta_${this.idVenta}.pdf`, 'No se pudo generar el ticket de venta.', () => this.generatingTicket.set(false));
    }

    protected openDocuments(): void {
        if (this.generatingDocuments() || this.idVenta <= 0) return;
        this.generatingDocuments.set(true);
        this.openPdf(this.api.getDocumentsPdf(this.idVenta), `Documentos_Venta_${this.idVenta}.pdf`, 'No se pudieron generar los documentos de la venta.', () => this.generatingDocuments.set(false));
    }

    protected openDocument(documento: VentaDocumentoItem): void {
        if (documento.tipo === 'VENTA_TICKET') { this.openTicket(); return; }
        this.openPdf(this.api.getMisasTicket(this.idVenta), `Registro_Misas_Venta_${this.idVenta}.pdf`, 'No se pudo generar el registro de misas.');
    }

    protected printDocument(documento: VentaDocumentoItem): void {
        if (this.idVenta <= 0) return;
        if (this.printMode().isActive && this.printMode().modo === 'AUTOMATICO') {
            this.api.printDocument(this.idVenta, documento.tipo).subscribe({
                next: result => { this.refreshPrintStatus(); this.snackBar.open(result.mensaje, 'Cerrar', { duration: result.exitosa ? 2500 : 5000 }); },
                error: () => this.snackBar.open('No se pudo enviar el documento a la impresora automática.', 'Cerrar', { duration: 5000 })
            });
            return;
        }
        const preview = window.open('', '_blank');
        this.api.requestPrint(this.idVenta, documento.tipo).subscribe({
            next: result => { this.loadDocuments(); this.snackBar.open(result.mensaje, 'Cerrar', { duration: 2500 }); const request = documento.tipo === 'VENTA_TICKET' ? this.api.getTicket(this.idVenta) : this.api.getMisasTicket(this.idVenta); this.openPdf(request, documento.tipo === 'VENTA_TICKET' ? `Ticket_Venta_${this.idVenta}.pdf` : `Registro_Misas_Venta_${this.idVenta}.pdf`, 'No se pudo abrir el documento para imprimir.', undefined, preview); },
            error: () => { preview?.close(); this.snackBar.open('No se pudo registrar la solicitud de impresión.', 'Cerrar', { duration: 4000 }); }
        });
    }

    protected correctIntentions(documento: VentaDocumentoItem): void {
        if (!this.canCorrectMisa() || documento.tipo !== 'MISA_REGISTRO' || documento.misas.length === 0) return;
        this.dialog.open(MisaIntentionCorrectionDialog, { data: { misas: documento.misas }, width: '800px', maxWidth: '95vw' }).afterClosed().subscribe(saved => { if (saved) { this.loadDocuments(); this.snackBar.open('Intenciones corregidas. Ya puedes reimprimir el registro de Misas.', 'Cerrar', { duration: 3500 }); } });
    }


    protected printJobLabel(documento: VentaDocumentoItem): string {
        switch (documento.estadoUltimoTrabajo) {
            case 'PENDIENTE': return 'Pendiente';
            case 'PROCESANDO': return 'Imprimiendo';
            case 'COMPLETADO': return 'Enviado al spooler';
            case 'ERROR': return 'Error';
            default: return '';
        }
    }

    private refreshPrintStatus(): void {
        this.loadDocuments();
        window.setTimeout(() => this.loadDocuments(), 1500);
        window.setTimeout(() => this.loadDocuments(), 4000);
    }

    private loadDocuments(): void {
        this.api.getDocuments(this.idVenta).subscribe({ next: result => this.documents.set(result), error: () => this.documents.set(null) });
    }

    private loadPrintMode(): void {
        this.api.getPrintMode().subscribe({ next: result => this.printMode.set(result), error: () => this.printMode.set({ modo: 'MANUAL', isActive: true }) });
    }

    private openPdf(request: ReturnType<VentaApiService['getTicket']>, fileName: string, errorMessage: string, finalize?: () => void, existingPreview?: Window | null): void {
        const preview = existingPreview ?? window.open('', '_blank');
        request.subscribe({
            next: blob => { finalize?.(); const url = URL.createObjectURL(blob); if (preview) preview.location.href = url; else { const link = document.createElement('a'); link.href = url; link.download = fileName; link.click(); } window.setTimeout(() => URL.revokeObjectURL(url), 60000); },
            error: () => { finalize?.(); preview?.close(); this.snackBar.open(errorMessage, 'Cerrar', { duration: 4000 }); }
        });
    }

    protected itemCode(item: VentaDetailItem): string {
        return item.tipoItem === 'SERVICIO' ? item.referencia || item.codigo : item.codigo;
    }
}