import { Component, computed, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { isInitialConfigurationNavigationVisible } from '../../core/auth/guards/initial-configuration-access';
import { AuthStore } from '../../features/auth/data-access/auth.store';
import { ConfiguracionInicialStore } from '../../features/configuracion/data-access/configuracion-inicial.store';
import { ConfiguracionParroquiaIdentidadStore } from '../../features/configuracion/data-access/configuracion-parroquia-identidad.store';
import { ModuleStore } from '../../features/configuracion/data-access/module.store';
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
    private readonly moduleStore = inject(ModuleStore);
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

        const setupState = this.configuracionInicialStore.state();
        const setupCompleted = setupState?.configuracionInicialCompletada === true;
        const licenseValid = this.moduleStore.state()?.licenciaValida === true;

        const setupOrder = new Map([['configuracion', 0], ['seguridad', 1], ['principal', 2]]);
        const setupFiltered = setupCompleted
            ? sections
            : sections
                .map(section => ({
                    ...section,
                    items: section.items.filter(item =>
                        isInitialConfigurationNavigationVisible(item.route, licenseValid)
                    )
                }))
                .filter(section => section.items.length > 0)
                .sort((a, b) => (setupOrder.get(a.id) ?? 99) - (setupOrder.get(b.id) ?? 99));

        return setupFiltered
            .map(section => ({
                ...section,
                items: section.items.filter(item => !item.modules?.length || this.moduleStore.hasAll(item.modules))
            }))
            .filter(section => section.items.length > 0);
    });

    protected navigate(): void {
        this.closeRequested.emit();
    }
}
