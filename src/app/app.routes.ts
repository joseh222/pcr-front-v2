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
        loadComponent: () => import('./features/auth/pages/change-password/change-password').then(module => module.ChangePasswordPage)
    },
    {
        path: '',
        canActivate: [authGuard, passwordChangeRequiredGuard],
        loadComponent: () => import('./layout/app-shell/app-shell').then(module => module.AppShell),

        children: [
            {
                path: 'dashboard',
                title: 'Dashboard | PCR Front V2',
                loadComponent: () => import('./features/dashboard/pages/dashboard').then(module => module.DashboardPage)
            },
            {
                path: 'misas',
                title: 'Misas | PCR Front V2',
                loadComponent: () => import('./features/misas/pages/misa-list/misa-list').then(module => module.MisaListPage)
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            }
        ]
    },
    {
        path: '**',
        title: 'Página no encontrada | PCR Front V2',
        loadComponent: () => import('./shared/pages/not-found/not-found').then(module => module.NotFound)
    }
];