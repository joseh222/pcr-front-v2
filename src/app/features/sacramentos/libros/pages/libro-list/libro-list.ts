import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PERMISSION_CODE } from '../../../../../core/auth/permission-code.model';
import { getApiErrorMessage } from '../../../../../core/feedback/api-error-message';
import { AuthStore } from '../../../../auth/data-access/auth.store';
import { LibroSacramentalApiService } from '../../data-access/libro-sacramental-api.service';
import { EstadoDigitalizacionCatalogItem, EstadoFisicoCatalogItem, LibroSacramentalListItem, SacramentoCatalogItem } from '../../data-access/models/libro-sacramental.models';

@Component({ selector: 'pcr-libro-sacramental-list', imports: [DatePipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatTableModule], templateUrl: './libro-list.html', styleUrl: './libro-list.scss' })
export class LibroSacramentalListPage implements OnInit {
    private readonly api = inject(LibroSacramentalApiService); private readonly fb = inject(FormBuilder); private readonly authStore = inject(AuthStore);
    protected readonly loading = signal(false); protected readonly error = signal<string | null>(null); protected readonly items = signal<readonly LibroSacramentalListItem[]>([]); protected readonly tipos = signal<readonly SacramentoCatalogItem[]>([]); protected readonly estadosFisicos = signal<readonly EstadoFisicoCatalogItem[]>([]); protected readonly estadosDigitalizacion = signal<readonly EstadoDigitalizacionCatalogItem[]>([]);
    protected readonly canCreate = computed(() => this.authStore.hasPermission(PERMISSION_CODE.SACRAMENTAL_BOOK_CREATE)); protected readonly canEdit = computed(() => this.authStore.hasPermission(PERMISSION_CODE.SACRAMENTAL_BOOK_EDIT));
    protected readonly displayedColumns = ['libro', 'folios', 'estadoFisico', 'digitalizacion', 'ubicacion', 'acciones'];
    readonly filterForm = this.fb.group({ numeroLibro: this.fb.nonNullable.control(''), idTipoSacramento: this.fb.control<number | null>(null), codigoEstadoFisico: this.fb.control<string | null>(null), codigoEstadoDigitalizacion: this.fb.control<string | null>(null) });
    ngOnInit(): void { this.loadCatalogs(); this.load(); }
    protected search(): void { this.load(); }
    protected clearFilters(): void { this.filterForm.reset({ numeroLibro: '', idTipoSacramento: null, codigoEstadoFisico: null, codigoEstadoDigitalizacion: null }); this.load(); }
    protected reload(): void { this.load(); }
    protected canEditBook(item: LibroSacramentalListItem): boolean { return this.canEdit() && item.codigoEstadoDigitalizacion !== 'COMPLETADA'; }
    private loadCatalogs(): void { forkJoin({ tipos: this.api.getTiposSacramento(), fisicos: this.api.getEstadosFisicos(), digitales: this.api.getEstadosDigitalizacion() }).subscribe({ next: result => { this.tipos.set(result.tipos); this.estadosFisicos.set(result.fisicos); this.estadosDigitalizacion.set(result.digitales); }, error: error => this.error.set(getApiErrorMessage(error, 'No se pudieron cargar los catálogos sacramentales.')) }); }
    private load(): void { this.loading.set(true); this.error.set(null); const raw = this.filterForm.getRawValue(); this.api.getList({ ...raw, soloActivos: true }).subscribe({ next: items => { this.items.set(items); this.loading.set(false); }, error: error => { this.items.set([]); this.error.set(getApiErrorMessage(error, 'No se pudieron cargar los libros sacramentales.')); this.loading.set(false); } }); }
}
