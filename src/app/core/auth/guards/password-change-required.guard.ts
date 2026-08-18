import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../../../features/auth/data-access/auth.store';

export const passwordChangeRequiredGuard: CanActivateFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
        return router.createUrlTree(['/login']);
    }

    if (authStore.mustChangePassword()) {
        return router.createUrlTree(['/change-password']);
    }

    return true;
};