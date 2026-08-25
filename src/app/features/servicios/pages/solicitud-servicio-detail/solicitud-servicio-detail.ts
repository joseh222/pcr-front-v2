import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SolicitudServicioCancellationService } from '../../data-access/solicitud-servicio-cancellation.service';
import { SolicitudServicioDetailStore } from '../../data-access/models/solicitud-servicio-detail.store';
import { canCancelSolicitud, canChargeSolicitud, canEditSolicitud, isMisaSolicitud } from '../../data-access/models/solicitud-servicio.rules';

@Component({
    selector: 'pcr-solicitud-servicio-detail',
    imports: [CurrencyPipe, DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule],
    providers: [SolicitudServicioDetailStore],
    templateUrl: './solicitud-servicio-detail.html',
    styleUrl: './solicitud-servicio-detail.scss'
})
export class SolicitudServicioDetailPage implements OnInit {
    protected readonly store = inject(SolicitudServicioDetailStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly cancellation = inject(SolicitudServicioCancellationService);
    private idSolicitudServicio = 0;

    ngOnInit(): void {
        this.idSolicitudServicio = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isInteger(this.idSolicitudServicio) || this.idSolicitudServicio <= 0) { void this.router.navigate(['/servicios']); return; }
        this.store.load(this.idSolicitudServicio);
    }

    protected isMisa(): boolean { const item = this.store.detail(); return !!item && isMisaSolicitud(item); }
    protected canEdit(): boolean { const item = this.store.detail(); return !!item && canEditSolicitud(item); }
    protected canCancel(): boolean { const item = this.store.detail(); return !!item && canCancelSolicitud(item); }
    protected canCharge(): boolean { const item = this.store.detail(); return !!item && canChargeSolicitud(item); }
    protected cancel(): void {
        const item = this.store.detail();
        if (!item || !this.canCancel()) return;
        this.cancellation.cancel(item).subscribe(result => { if (result) this.store.load(this.idSolicitudServicio); });
    }
}
