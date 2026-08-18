import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserMenu } from './user-menu/user-menu';
import { ThemeMenu } from './theme-menu/theme-menu';


@Component({
    selector: 'pcr-topbar',
    imports: [MatButtonModule, MatIconModule, UserMenu, ThemeMenu],
    templateUrl: './topbar.html',
    styleUrl: './topbar.scss'
})
export class Topbar {
    readonly sidebarCollapsed = input(false);
    readonly mobileMenuRequested = output<void>();
    readonly desktopMenuRequested = output<void>();
}
