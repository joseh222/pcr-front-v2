import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { getApiErrorMessage } from '../../../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { LibroSacramentalApiService } from '../../data-access/libro-sacramental-api.service';
import { EstadoFisicoCatalogItem, LibroSacramentalDetail, SacramentoCatalogItem } from '../../data-access/models/libro-sacramental.models';

import { SacramentalUppercaseDirective } from '../../../shared/sacramental-uppercase.directive';
@Component({ selector: 'pcr-libro-sacramental-form', imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule,SacramentalUppercaseDirective], templateUrl: './libro-form.html', styleUrl: './libro-form.scss' })
export class LibroSacramentalFormPage implements OnInit {
    private readonly api = inject(LibroSacramentalApiService); private readonly fb = inject(FormBuilder); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); private readonly feedback = inject(FeedbackService);
    private readonly id = Number(this.route.snapshot.paramMap.get('id') ?? 0); protected readonly isEdit = this.id > 0; protected readonly loading = signal(this.isEdit); protected readonly saving = signal(false); protected readonly error = signal<string | null>(null); protected readonly detail = signal<LibroSacramentalDetail | null>(null); protected readonly tipos = signal<readonly SacramentoCatalogItem[]>([]); protected readonly estadosFisicos = signal<readonly EstadoFisicoCatalogItem[]>([]);
    protected readonly title = computed(() => this.isEdit ? 'Editar libro sacramental' : 'Nuevo libro sacramental'); protected readonly structureLocked = computed(() => this.isEdit && this.detail()?.codigoEstadoDigitalizacion !== 'PENDIENTE'); protected readonly completed = computed(() => this.detail()?.codigoEstadoDigitalizacion === 'COMPLETADA');
    readonly form = this.fb.group({ idTipoSacramento: this.fb.control<number | null>(null, Validators.required), numeroLibro: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(30)]), folioInicial: this.fb.control<number | null>(1, [Validators.required, Validators.min(1)]), folioFinal: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]), codigoEstadoFisico: this.fb.nonNullable.control('DISPONIBLE'), fechaAperturaFisica: this.fb.control<string | null>(null), fechaCierreFisica: this.fb.control<string | null>(null), ubicacionFisica: this.fb.nonNullable.control('', Validators.maxLength(250)), observaciones: this.fb.nonNullable.control('', Validators.maxLength(1000)) });
    ngOnInit(): void { if (this.isEdit) this.loadForEdit(); else this.loadCatalogs(); }
    protected save(): void {
        if (this.completed()) { this.feedback.warning('La digitalización está completada. Reábrela desde el detalle antes de realizar correcciones.'); return; }
        if (this.form.invalid || !this.validDates() || !this.validFolios()) { this.form.markAllAsTouched(); return; }
        const raw = this.form.getRawValue(); this.saving.set(true); this.error.set(null);
        const common = { idTipoSacramento: raw.idTipoSacramento!, numeroLibro: raw.numeroLibro.trim(), folioInicial: raw.folioInicial!, folioFinal: raw.folioFinal!, fechaAperturaFisica: raw.fechaAperturaFisica || null, fechaCierreFisica: raw.fechaCierreFisica || null, ubicacionFisica: raw.ubicacionFisica.trim() || null, observaciones: raw.observaciones.trim() || null };
        const request$ = this.isEdit ? this.api.update(this.id, { ...common, rowVersion: this.detail()!.rowVersion }) : this.api.create({ ...common, codigoEstadoFisico: raw.codigoEstadoFisico });
        request$.subscribe({ next: result => { this.feedback.success(result.mensaje); this.saving.set(false); void this.router.navigate(['/sacramentos/libros', result.idLibroSacramental]); }, error: error => { this.error.set(getApiErrorMessage(error, 'No se pudo guardar el libro sacramental.')); this.saving.set(false); } });
    }
    protected validFolios(): boolean { const raw = this.form.getRawValue(); return !!raw.folioInicial && !!raw.folioFinal && raw.folioFinal >= raw.folioInicial && raw.folioFinal - raw.folioInicial + 1 <= 10000; }
    protected validDates(): boolean { const raw = this.form.getRawValue(); return !raw.fechaAperturaFisica || !raw.fechaCierreFisica || raw.fechaCierreFisica >= raw.fechaAperturaFisica; }
    private loadCatalogs(): void { forkJoin({ tipos: this.api.getTiposSacramento(), estados: this.api.getEstadosFisicos() }).subscribe({ next: result => { this.tipos.set(result.tipos); this.estadosFisicos.set(result.estados); }, error: error => this.error.set(getApiErrorMessage(error, 'No se pudieron cargar los catálogos.')) }); }
    private loadForEdit(): void { forkJoin({ tipos: this.api.getTiposSacramento(), estados: this.api.getEstadosFisicos(), detail: this.api.getById(this.id) }).subscribe({ next: result => { this.tipos.set(result.tipos); this.estadosFisicos.set(result.estados); this.detail.set(result.detail); this.form.patchValue({ idTipoSacramento: result.detail.idTipoSacramento, numeroLibro: result.detail.numeroLibro, folioInicial: result.detail.folioInicial, folioFinal: result.detail.folioFinal, codigoEstadoFisico: result.detail.codigoEstadoFisico, fechaAperturaFisica: result.detail.fechaAperturaFisica?.slice(0,10) ?? null, fechaCierreFisica: result.detail.fechaCierreFisica?.slice(0,10) ?? null, ubicacionFisica: result.detail.ubicacionFisica ?? '', observaciones: result.detail.observaciones ?? '' }); if (this.structureLocked()) { this.form.controls.idTipoSacramento.disable(); this.form.controls.numeroLibro.disable(); this.form.controls.folioInicial.disable(); this.form.controls.folioFinal.disable(); } if (this.completed()) this.form.disable(); this.loading.set(false); }, error: error => { this.error.set(getApiErrorMessage(error, 'No se pudo cargar el libro sacramental.')); this.loading.set(false); } }); }
}
