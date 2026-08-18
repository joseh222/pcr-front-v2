import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthRole } from '../auth-role.model';
import { AuthStore } from '../../../features/auth/data-access/auth.store';

export const roleGuard: CanActivateFn = (route) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
        return router.createUrlTree(['/login']);
    }

    const roles = route.data['roles'] as AuthRole[] | undefined;

    if (!roles?.length || roles.some(role => authStore.hasRole(role))) {
        return true;
    }

    return router.createUrlTree(['/dashboard']);
};