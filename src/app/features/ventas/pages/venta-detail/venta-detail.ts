import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VentaCancellationService } from '../../data-access/venta-cancellation.service';
import { VentaDetailStore } from '../../data-access/models/venta-detail.store';
import { VentaDetailItem } from '../../data-access/models/venta-read.models';

@Component({
    selector: 'pcr-venta-detail',
    imports: [CurrencyPipe, DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule],
    providers: [VentaDetailStore],
    templateUrl: './venta-detail.html',
    styleUrl: './venta-detail.scss'
})
export class VentaDetailPage implements OnInit {
    protected readonly store = inject(VentaDetailStore);
    private readonly route = inject(ActivatedRoute);
    private readonly cancellation = inject(VentaCancellationService);
    private idVenta = 0;

    ngOnInit(): void {
        this.idVenta = Number(this.route.snapshot.paramMap.get('id'));
        if (Number.isInteger(this.idVenta) && this.idVenta > 0) this.store.load(this.idVenta);
    }

    protected cancel(): void {
        const venta = this.store.detail();
        if (!venta?.puedeAnular) return;

        this.cancellation.cancel(venta).subscribe(result => {
            if (result) this.store.load(this.idVenta);
        });
    }

    protected itemCode(item: VentaDetailItem): string {
        return item.tipoItem === 'SERVICIO' ? item.referencia || item.codigo : item.codigo;
    }
}