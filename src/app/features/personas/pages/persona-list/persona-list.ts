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
import { PersonaListFilters, PersonaListItem } from '../../data-access/models/persona-api.models';
import { PersonaListStore } from '../../data-access/models/persona-list.store';
import { PersonaStatusService } from '../../data-access/persona-status.service';

@Component({
    selector: 'pcr-persona-list',
    imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatTableModule],
    providers: [PersonaListStore],
    templateUrl: './persona-list.html',
    styleUrl: './persona-list.scss'
})
export class PersonaListPage implements OnInit {
    protected readonly store = inject(PersonaListStore);
    private readonly fb = inject(FormBuilder);
    private readonly statusService = inject(PersonaStatusService);

    readonly filterForm = this.fb.group({
        search: this.fb.nonNullable.control(''),
        idTipoDocumento: this.fb.control<number | null>(null),
        idRolPersona: this.fb.control<number | null>(null),
        isActive: this.fb.control<boolean | null>(true)
    });

    protected readonly displayedColumns = ['codigo', 'persona', 'documento', 'roles', 'contacto', 'estado', 'acciones'];

    ngOnInit(): void { this.store.loadCatalogs(); this.store.load(); }
    protected search(): void { this.store.search(this.filterForm.getRawValue() as PersonaListFilters); }
    protected clearFilters(): void {
        this.filterForm.reset({ search: '', idTipoDocumento: null, idRolPersona: null, isActive: true });
        this.store.resetFilters();
    }
    protected reload(): void { this.store.reload(); }
    protected changeStatus(persona: PersonaListItem): void {
        this.statusService.change(persona).subscribe(changed => { if (changed) this.store.reload(); });
    }
    protected onPage(event: PageEvent): void {
        if (event.pageSize !== this.store.pageSize()) { this.store.changePageSize(event.pageSize); return; }
        this.store.changePage(event.pageIndex + 1);
    }
}
