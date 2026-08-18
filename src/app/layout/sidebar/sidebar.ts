import { Component, computed, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthStore } from '../../features/auth/data-access/auth.store';
import { APP_NAVIGATION } from '../navigation/app-navigation.config';
import { filterNavigationByRole } from '../navigation/navigation-access';

@Component({
    selector: 'pcr-sidebar',
    imports: [MatIconModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss'
})
export class Sidebar {
    private readonly authStore = inject(AuthStore);

    readonly open = input(false);
    readonly collapsed = input(false);
    readonly closeRequested = output<void>();

    protected readonly navigationSections = computed(() =>
        filterNavigationByRole(
            APP_NAVIGATION,
            this.authStore.roleCode()
        )
    );

    protected navigate(): void {
        this.closeRequested.emit();
    }
}