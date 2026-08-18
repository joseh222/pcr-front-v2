import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterOutlet } from '@angular/router';

import { AuthStore } from '../../features/auth/data-access/auth.store';

@Component({
    selector: 'pcr-app-shell',
    imports: [RouterOutlet, MatButtonModule, MatIconModule, MatMenuModule],
    templateUrl: './app-shell.html',
    styleUrl: './app-shell.scss'
})
export class AppShell {
    protected readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);

    protected readonly sidebarOpen = signal(false);
    protected readonly sidebarCollapsed = signal(false);
    protected readonly isLoggingOut = signal(false);

    protected toggleSidebar(): void {
        this.sidebarOpen.update(open => !open);
    }

    protected closeSidebar(): void {
        this.sidebarOpen.set(false);
    }

    protected toggleDesktopSidebar(): void {
        this.sidebarCollapsed.update(collapsed => !collapsed);
    }

    protected async logout(): Promise<void> {
        if (this.isLoggingOut()) {
            return;
        }

        this.isLoggingOut.set(true);

        try {
            await this.authStore.logout();
        } catch {
            // AuthStore limpia igualmente la sesión local.
        } finally {
            this.isLoggingOut.set(false);
            await this.router.navigateByUrl('/login', { replaceUrl: true });
        }
    }
}