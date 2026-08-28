import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SolicitudServicioCancellationService } from '../../data-access/solicitud-servicio-cancellation.service';
import { SolicitudServicioListStore } from '../../data-access/models/solicitud-servicio-list.store';
import { SolicitudServicioListFilters, SolicitudServicioListItem } from '../../data-access/models/solicitud-servicio-read.models';
import { canCancelSolicitud, canChargeSolicitud, canEditSolicitud, isMisaSolicitud } from '../../data-access/models/solicitud-servicio.rules';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';

@Component({
    selector: 'pcr-solicitud-servicio-list',
    imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatTableModule],
    providers: [SolicitudServicioListStore],
    templateUrl: './solicitud-servicio-list.html',
    styleUrl: './solicitud-servicio-list.scss'
})
export class SolicitudServicioListPage implements OnInit {
    protected readonly store = inject(SolicitudServicioListStore);
    private readonly fb = inject(FormBuilder);
    private readonly cancellation = inject(SolicitudServicioCancellationService);
    private readonly authStore = inject(AuthStore);
    protected readonly canCreate = () => this.authStore.hasPermission(PERMISSION_CODE.SERVICE_REQUEST_CREATE);

    protected readonly filterForm = this.fb.group({
        search: this.fb.nonNullable.control(''),
        idServicio: this.fb.control<number | null>(null),
        estadoSolicitud: this.fb.control<string | null>(null),
        estadoPago: this.fb.control<string | null>(null),
        requierePago: this.fb.control<boolean | null>(null),
        fechaInicio: this.fb.control<string | null>(null),
        fechaFin: this.fb.control<string | null>(null)
    });

    protected readonly displayedColumns = ['codigo', 'servicio', 'solicitante', 'fecha', 'importe', 'estado', 'pago', 'acciones'];

    ngOnInit(): void { this.store.loadCatalogs(); this.store.load(); }

    protected search(): void { this.store.search(this.filterForm.getRawValue() as SolicitudServicioListFilters); }
    protected clearFilters(): void {
        this.filterForm.reset({ search: '', idServicio: null, estadoSolicitud: null, estadoPago: null, requierePago: null, fechaInicio: null, fechaFin: null });
        this.store.resetFilters();
    }
    protected reload(): void { this.store.reload(); }
    protected onPage(event: PageEvent): void {
        if (event.pageSize !== this.store.pageSize()) { this.store.changePageSize(event.pageSize); return; }
        this.store.changePage(event.pageIndex + 1);
    }
    protected isMisa(item: SolicitudServicioListItem): boolean { return isMisaSolicitud(item); }
    protected canEdit(item: SolicitudServicioListItem): boolean { return this.authStore.hasPermission(PERMISSION_CODE.SERVICE_REQUEST_EDIT) && canEditSolicitud(item); }
    protected canCancel(item: SolicitudServicioListItem): boolean { return this.authStore.hasPermission(PERMISSION_CODE.SERVICE_REQUEST_CANCEL) && canCancelSolicitud(item); }
    protected canCharge(item: SolicitudServicioListItem): boolean { return this.authStore.hasPermission(PERMISSION_CODE.SALE_CREATE) && canChargeSolicitud(item); }
    protected cancel(item: SolicitudServicioListItem): void {
        if (!this.canCancel(item)) return;
        this.cancellation.cancel(item).subscribe(result => { if (result) this.store.reload(); });
    }
}
