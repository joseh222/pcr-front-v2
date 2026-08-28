import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

import { AuthStore } from '../../../features/auth/data-access/auth.store';

@Component({
    selector: 'pcr-user-menu',
    imports: [MatButtonModule, MatIconModule, MatMenuModule],
    templateUrl: './user-menu.html',
    styleUrl: './user-menu.scss'
})
export class UserMenu {
    private readonly router = inject(Router);

    protected readonly authStore = inject(AuthStore);
    protected readonly isLoggingOut = signal(false);
    protected readonly roleLabel = computed(() => { const roles = this.authStore.roleCodes(); if (!roles.length) return 'Sin rol'; return roles.length <= 2 ? roles.join(' · ') : `${roles.slice(0, 2).join(' · ')} +${roles.length - 2}`; });
    protected readonly roleDetail = computed(() => this.authStore.roleCodes().join(' · ') || 'Sin rol');

    protected async logout(): Promise<void> {
        if (this.isLoggingOut()) {
            return;
        }

        this.isLoggingOut.set(true);

        try {
            await this.authStore.logout();
        } catch {
            // AuthStore limpia la sesión local incluso si falla el endpoint.
        } finally {
            this.isLoggingOut.set(false);
            await this.router.navigateByUrl('/login', { replaceUrl: true });
        }
    }
}