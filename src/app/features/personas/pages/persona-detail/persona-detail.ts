import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonaDetailStore } from '../../data-access/models/persona-detail.store';
import { PersonaStatusService } from '../../data-access/persona-status.service';

@Component({
    selector: 'pcr-persona-detail',
    imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule],
    providers: [PersonaDetailStore],
    templateUrl: './persona-detail.html',
    styleUrl: './persona-detail.scss'
})
export class PersonaDetailPage implements OnInit {
    protected readonly store = inject(PersonaDetailStore);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly statusService = inject(PersonaStatusService);
    protected idPersona = 0;

    ngOnInit(): void {
        this.idPersona = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isInteger(this.idPersona) || this.idPersona <= 0) {
            void this.router.navigate(['/personas']);
            return;
        }
        this.store.load(this.idPersona);
    }

    protected changeStatus(): void {
        const person = this.store.detail();
        if (!person) return;
        this.statusService.change(person).subscribe(changed => {
            if (changed) this.store.load(this.idPersona);
        });
    }
}
