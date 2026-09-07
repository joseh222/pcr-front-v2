import { Component, computed, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { isInitialConfigurationRouteAllowed } from '../../core/auth/guards/initial-configuration-access';
import { AuthStore } from '../../features/auth/data-access/auth.store';
import { ConfiguracionInicialStore } from '../../features/configuracion/data-access/configuracion-inicial.store';
import { ConfiguracionParroquiaIdentidadStore } from '../../features/configuracion/data-access/configuracion-parroquia-identidad.store';
import { APP_NAVIGATION } from '../navigation/app-navigation.config';
import { filterNavigationByAccess } from '../navigation/navigation-access';

@Component({
    selector: 'pcr-sidebar',
    imports: [MatIconModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss'
})
export class Sidebar {
    private readonly authStore = inject(AuthStore);
    private readonly configuracionInicialStore = inject(ConfiguracionInicialStore);
    protected readonly identidadStore = inject(ConfiguracionParroquiaIdentidadStore);

    readonly open = input(false);
    readonly collapsed = input(false);
    readonly closeRequested = output<void>();

    protected readonly navigationSections = computed(() => {
        const sections = filterNavigationByAccess(
            APP_NAVIGATION,
            this.authStore.roleCode(),
            this.authStore.permissions(),
            this.authStore.grantsAllPermissions()
        );

        const estado = this.configuracionInicialStore.state();
        const configuracionPendiente = estado?.configuracionInicialCompletada !== true;

        if (!configuracionPendiente) return sections;

        return sections
            .map(section => ({
                ...section,
                items: section.items.filter(item => isInitialConfigurationRouteAllowed(item.route))
            }))
            .filter(section => section.items.length > 0);
    });

    protected navigate(): void {
        this.closeRequested.emit();
    }
}
