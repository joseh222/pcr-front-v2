import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { Footer } from '../footer/footer';

@Component({
    selector: 'pcr-app-shell',
    imports: [RouterOutlet, Sidebar, Topbar, Footer],
    templateUrl: './app-shell.html',
    styleUrl: './app-shell.scss'
})
export class AppShell {
    protected readonly sidebarOpen = signal(false);
    protected readonly sidebarCollapsed = signal(false);

    protected toggleSidebar(): void {
        this.sidebarOpen.update(open => !open);
    }

    protected closeSidebar(): void {
        this.sidebarOpen.set(false);
    }

    protected toggleDesktopSidebar(): void {
        this.sidebarCollapsed.update(collapsed => !collapsed);
    }
}