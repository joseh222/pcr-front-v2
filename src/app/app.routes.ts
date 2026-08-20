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
                path: 'productos/nuevo',
                title: 'Nuevo producto | PCR Front V2',
                loadComponent: () => import('./features/productos/pages/producto-form/producto-form').then(module => module.ProductoFormPage)
            },
            {
                path: 'productos/:id/editar',
                title: 'Editar producto | PCR Front V2',
                loadComponent: () => import('./features/productos/pages/producto-form/producto-form').then(module => module.ProductoFormPage)
            },
            {
                path: 'productos',
                title: 'Productos | PCR Front V2',
                loadComponent: () => import('./features/productos/pages/producto-list/producto-list').then(module => module.ProductoListPage)
            },
            {
                path: 'ventas/nueva',
                title: 'Nueva venta | PCR Front V2',
                loadComponent: () => import('./features/ventas/pages/venta-form/venta-form').then(module => module.VentaFormPage)
            },
            {
                path: 'ventas/:id',
                title: 'Detalle de venta | PCR Front V2',
                loadComponent: () => import('./features/ventas/pages/venta-detail/venta-detail').then(module => module.VentaDetailPage)
            },
            {
                path: 'ventas',
                title: 'Ventas | PCR Front V2',
                loadComponent: () => import('./features/ventas/pages/venta-list/venta-list').then(module => module.VentaListPage)
            },
            {
                path: 'misas/nueva',
                title: 'Nueva misa | PCR Front V2',
                loadComponent: () => import('./features/misas/pages/misa-form/misa-form').then(module => module.MisaFormPage)
            },
            {
                path: 'misas/:id/editar',
                title: 'Editar misa | PCR Front V2',
                loadComponent: () => import('./features/misas/pages/misa-form/misa-form').then(module => module.MisaFormPage)
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