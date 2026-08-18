import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
    selector: 'pcr-misa-form',
    imports: [MatButtonModule, MatIconModule, RouterLink],
    templateUrl: './misa-form.html',
    styleUrl: './misa-form.scss'
})
export class MisaFormPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly idMisa =
        signal<number | null>(null);

    protected readonly isEditMode = computed(
        () => this.idMisa() !== null
    );

    protected readonly pageTitle = computed(
        () =>
            this.isEditMode()
                ? 'Editar misa'
                : 'Nueva misa'
    );

    protected readonly pageDescription = computed(
        () =>
            this.isEditMode()
                ? 'Edita la información de la misa seleccionada.'
                : 'Registra una nueva misa e intenciones parroquiales.'
    );

    ngOnInit(): void {
        const rawId =
            this.route.snapshot.paramMap.get('id');

        if (rawId === null) {
            return;
        }

        const idMisa = Number(rawId);

        if (
            !Number.isInteger(idMisa) ||
            idMisa <= 0
        ) {
            void this.router.navigate(['/misas']);
            return;
        }

        this.idMisa.set(idMisa);
    }
}