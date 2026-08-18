import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guards/guest.guard';
import { authGuard } from './core/auth/guards/auth.guard';
import { passwordChangeRequiredGuard } from './core/auth/guards/password-change-required.guard';

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [guestGuard],
        loadChildren: () => import('./features/auth/auth.routes').then(module => module.AUTH_ROUTES)
    },
    {
        path: 'change-password',
        title: 'Cambiar contraseña | PCR Front V2',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/auth/pages/change-password/change-password')
                .then(module => module.ChangePasswordPage)
    },
    {
        path: '',
        pathMatch: 'full',
        title: 'PCR Front V2',
        canActivate: [authGuard, passwordChangeRequiredGuard],
        loadComponent: () => import('./layout/app-shell/app-shell').then(module => module.AppShell)
    },
    {
        path: '**',
        title: 'Página no encontrada | PCR Front V2',
        loadComponent: () => import('./shared/pages/not-found/not-found').then(module => module.NotFound)
    }
];