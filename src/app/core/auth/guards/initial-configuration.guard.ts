import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { ConfiguracionInicialStore } from '../../../features/configuracion/data-access/configuracion-inicial.store';
import { ModuleStore } from '../../../features/configuracion/data-access/module.store';
import { PERMISSION_CODE } from '../permission-code.model';
import { isInitialConfigurationRouteAllowed, isPreLicenseRouteAllowed } from './initial-configuration-access';

export const initialConfigurationGuard: CanActivateFn = async (_route, state) => {
    const auth = inject(AuthStore);
    const setup = inject(ConfiguracionInicialStore);
    const modules = inject(ModuleStore);
    const router = inject(Router);

    if (!auth.isAuthenticated()) return router.createUrlTree(['/login']);
    if (auth.mustChangePassword()) return router.createUrlTree(['/change-password']);

    try {
        const status = await setup.load();
        if (status.configuracionInicialCompletada) return true;

        const license = await modules.load();
        const licenseValid = license.licenciaValida === true;

        if (isInitialConfigurationRouteAllowed(state.url, licenseValid)) return true;

        if (!licenseValid) {
            return auth.hasPermission(PERMISSION_CODE.LICENSE_VIEW)
                ? router.createUrlTree(['/configuracion/licencia'])
                : router.createUrlTree(['/forbidden']);
        }

        return auth.hasPermission(PERMISSION_CODE.INITIAL_SETUP_VIEW)
            ? router.createUrlTree(['/configuracion/inicial'])
            : router.createUrlTree(['/forbidden']);
    } catch {
        // La pantalla de licencia debe seguir siendo accesible para diagnosticar o recuperar
        // una instalación aunque falle la consulta del estado de licenciamiento.
        if (isPreLicenseRouteAllowed(state.url)) return true;

        return auth.hasPermission(PERMISSION_CODE.LICENSE_VIEW)
            ? router.createUrlTree(['/configuracion/licencia'])
            : router.createUrlTree(['/forbidden']);
    }
};
