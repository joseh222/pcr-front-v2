import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { APP_NAVIGATION } from '../navigation/app-navigation.config';

@Component({
    selector: 'pcr-sidebar',
    imports: [MatIconModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss'
})
export class Sidebar {
    readonly open = input(false);
    readonly collapsed = input(false);
    readonly closeRequested = output<void>();

    protected readonly navigationSections = APP_NAVIGATION;

    protected navigate(): void {
        this.closeRequested.emit();
    }
}