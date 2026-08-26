import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompraDetailStore } from '../../data-access/models/compra-detail.store';

@Component({
    selector: 'pcr-compra-detail',
    imports: [CurrencyPipe, DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule],
    providers: [CompraDetailStore],
    templateUrl: './compra-detail.html',
    styleUrl: './compra-detail.scss'
})
export class CompraDetailPage implements OnInit {
    protected readonly store = inject(CompraDetailStore);
    private readonly route = inject(ActivatedRoute);

    ngOnInit(): void {
        const idCompra = Number(this.route.snapshot.paramMap.get('id'));
        if (Number.isInteger(idCompra) && idCompra > 0) this.store.load(idCompra);
    }

    protected comprobante(serie: string | null, numero: string | null): string {
        return [serie, numero].filter(Boolean).join('-') || 'Sin número';
    }
}
