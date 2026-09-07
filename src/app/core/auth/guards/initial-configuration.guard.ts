import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { ConfiguracionInicialStore } from '../../../features/configuracion/data-access/configuracion-inicial.store';
import { PERMISSION_CODE } from '../permission-code.model';
import { isInitialConfigurationRouteAllowed } from './initial-configuration-access';

export const initialConfigurationGuard: CanActivateFn=async (_route,state)=>{
    const auth=inject(AuthStore); const setup=inject(ConfiguracionInicialStore); const router=inject(Router);
    if(!auth.isAuthenticated()) return router.createUrlTree(['/login']);
    if(auth.mustChangePassword()) return router.createUrlTree(['/change-password']);
    try {
        const status=await setup.load();
        if(status.configuracionInicialCompletada) return true;
        if(isInitialConfigurationRouteAllowed(state.url)) return true;
        if(auth.hasPermission(PERMISSION_CODE.INITIAL_SETUP_VIEW)) return router.createUrlTree(['/configuracion/inicial']);
        return router.createUrlTree(['/forbidden']);
    } catch {
        if(state.url.startsWith('/configuracion/inicial')) return true;
        return auth.hasPermission(PERMISSION_CODE.INITIAL_SETUP_VIEW)
            ? router.createUrlTree(['/configuracion/inicial'])
            : router.createUrlTree(['/forbidden']);
    }
};
