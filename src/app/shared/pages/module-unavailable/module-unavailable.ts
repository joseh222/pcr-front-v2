import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../core/auth/permission-code.model';

@Component({
    selector: 'app-module-unavailable',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, RouterLink],
    templateUrl: './module-unavailable.html',
    styleUrl: './module-unavailable.scss'
})
export class ModuleUnavailablePage {
    private readonly route = inject(ActivatedRoute);
    private readonly auth = inject(AuthStore);

    protected readonly modules = computed(() => (this.route.snapshot.queryParamMap.get('module') ?? 'MÓDULO')
        .split(',').map(value => value.trim()).filter(Boolean).join(', '));
    protected readonly canViewLicense = computed(() => this.auth.hasPermission(PERMISSION_CODE.LICENSE_VIEW));
}
