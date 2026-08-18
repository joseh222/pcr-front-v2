import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'pcr-topbar',
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './topbar.html',
    styleUrl: './topbar.scss'
})
export class Topbar {
    readonly sidebarCollapsed = input(false);
    readonly mobileMenuRequested = output<void>();
    readonly desktopMenuRequested = output<void>();
}
