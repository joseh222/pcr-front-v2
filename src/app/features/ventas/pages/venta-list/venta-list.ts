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
import { VentaListStore } from '../../data-access/models/venta-list.store';
import { VentaListFilters, VentaTipoItemFiltro } from '../../data-access/models/venta-read.models';

@Component({
    selector: 'pcr-venta-list',
    imports: [
        CurrencyPipe,
        DatePipe,
        ReactiveFormsModule,
        RouterLink,

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTableModule
    ],

    providers: [VentaListStore],
    templateUrl: './venta-list.html',
    styleUrl: './venta-list.scss'
})
export class VentaListPage implements OnInit {

    protected readonly store = inject(VentaListStore);
    private readonly fb = inject(FormBuilder);
    readonly filterForm = this.fb.group({
        texto: this.fb.nonNullable.control(''),
        fechaInicio: this.fb.control<string | null>(null),
        fechaFin: this.fb.control<string | null>(null),
        idMetodoPago: this.fb.control<number | null>(null),
        idTipoComprobante: this.fb.control<number | null>(null),
        tipoItem: this.fb.control<VentaTipoItemFiltro | null>(null)
    });

    protected readonly displayedColumns:
        string[] = [
            'codigo',
            'fecha',
            'cliente',
            'comprobante',
            'metodoPago',
            'contenido',
            'estado',
            'total'
        ];

    protected readonly itemTypes = [
        {
            value: 'PRODUCTO' as const,
            label: 'Productos'
        },
        {
            value: 'SERVICIO' as const,
            label: 'Servicios'
        }
    ];

    ngOnInit(): void {
        this.store.loadCatalogs();
        this.store.load();
    }

    protected search(): void {
        this.store.search(this.filterForm.getRawValue() as VentaListFilters);
    }

    protected clearFilters(): void {
        this.filterForm.reset({
            texto: '',
            fechaInicio: null,
            fechaFin: null,
            idMetodoPago: null,
            idTipoComprobante: null,
            tipoItem: null
        });
        this.store.resetFilters();
    }

    protected reload(): void {
        this.store.reload();
    }

    protected onPage(event: PageEvent): void {
        if (event.pageSize !== this.store.tamanoPagina()) {
            this.store.changePageSize(event.pageSize);
            return;
        }
        this.store.changePage(event.pageIndex + 1);
    }

    protected contentLabel(tieneProductos: boolean, tieneServicios: boolean): string {
        if (tieneProductos && tieneServicios) {
            return 'Productos + servicios';
        }

        if (tieneProductos) {
            return 'Productos';
        }

        if (tieneServicios) {
            return 'Servicios';
        }

        return 'Sin detalle';
    }
}