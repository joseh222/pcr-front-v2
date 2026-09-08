import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { Footer } from '../footer/footer';
import { ConfiguracionParroquiaIdentidadStore } from '../../features/configuracion/data-access/configuracion-parroquia-identidad.store';
import { ModuleStore } from '../../features/configuracion/data-access/module.store';

@Component({
    selector: 'pcr-app-shell',
    imports: [RouterOutlet, Sidebar, Topbar, Footer],
    templateUrl: './app-shell.html',
    styleUrl: './app-shell.scss'
})
export class AppShell implements OnInit {
    private readonly identidadStore = inject(ConfiguracionParroquiaIdentidadStore);
    private readonly moduleStore = inject(ModuleStore);
    protected readonly sidebarOpen = signal(false);
    protected readonly sidebarCollapsed = signal(false);

    ngOnInit(): void {
        void this.identidadStore.load().catch(() => undefined);
        void this.moduleStore.load().catch(() => undefined);
    }

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