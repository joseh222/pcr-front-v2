import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { ModuleStore } from '../../features/configuracion/data-access/module.store';
import { requiredModulesForUrl } from './module-route-access';

export const moduleAccessGuard: CanActivateChildFn = async (_route, state) => {
    const requiredModules = requiredModulesForUrl(state.url);
    if (!requiredModules.length) return true;

    const moduleStore = inject(ModuleStore);
    const router = inject(Router);

    try {
        await moduleStore.load();
        const missing = requiredModules.filter(module => !moduleStore.isEnabled(module));
        if (!missing.length) return true;

        return router.createUrlTree(['/module-unavailable'], {
            queryParams: { module: missing.join(',') }
        });
    } catch {
        return router.createUrlTree(['/module-unavailable'], {
            queryParams: { module: requiredModules.join(','), reason: 'license-status-unavailable' }
        });
    }
};
