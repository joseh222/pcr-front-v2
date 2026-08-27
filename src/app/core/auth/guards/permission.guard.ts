import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionCode } from '../permission-code.model';
import { AuthStore } from '../../../features/auth/data-access/auth.store';

export type PermissionGuardMode = 'all' | 'any';

export const permissionGuard: CanActivateFn = route => {
    const authStore = inject(AuthStore); const router = inject(Router);
    if (!authStore.isAuthenticated()) return router.createUrlTree(['/login']);
    const permissions = route.data['permissions'] as readonly PermissionCode[] | undefined;
    const mode = (route.data['permissionMode'] as PermissionGuardMode | undefined) ?? 'all';
    if (!permissions?.length || (mode === 'any' ? authStore.hasAnyPermission(permissions) : authStore.hasAllPermissions(permissions))) return true;
    return router.createUrlTree(['/dashboard']);
};
