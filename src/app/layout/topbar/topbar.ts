import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserMenu } from './user-menu/user-menu';
import { ThemeMenu } from './theme-menu/theme-menu';
import { ConfiguracionParroquiaIdentidadStore } from '../../features/configuracion/data-access/configuracion-parroquia-identidad.store';


@Component({
    selector: 'pcr-topbar',
    imports: [MatButtonModule, MatIconModule, UserMenu, ThemeMenu],
    templateUrl: './topbar.html',
    styleUrl: './topbar.scss'
})
export class Topbar {
    protected readonly identidadStore = inject(ConfiguracionParroquiaIdentidadStore);
    readonly sidebarCollapsed = input(false);
    readonly mobileMenuRequested = output<void>();
    readonly desktopMenuRequested = output<void>();
}
