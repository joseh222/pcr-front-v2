import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guards/guest.guard';
import { authGuard } from './core/auth/guards/auth.guard';
import { passwordChangeRequiredGuard } from './core/auth/guards/password-change-required.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { AUTH_ROLE } from './core/auth/auth-role.model';

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
                path: 'personas/nueva',
                title: 'Nueva persona | PCR Front V2',
                loadComponent: () => import('./features/personas/pages/persona-form/persona-form').then(module => module.PersonaFormPage)
            },
            {
                path: 'personas/:id/editar',
                title: 'Editar persona | PCR Front V2',
                loadComponent: () => import('./features/personas/pages/persona-form/persona-form').then(module => module.PersonaFormPage)
            },
            {
                path: 'personas/:id',
                title: 'Detalle de persona | PCR Front V2',
                loadComponent: () => import('./features/personas/pages/persona-detail/persona-detail').then(module => module.PersonaDetailPage)
            },
            {
                path: 'personas',
                title: 'Personas | PCR Front V2',
                loadComponent: () => import('./features/personas/pages/persona-list/persona-list').then(module => module.PersonaListPage)
            },
            {
                path: 'catalogos/servicios/nuevo',
                title: 'Nuevo servicio | PCR Front V2',
                loadComponent: () => import('./features/servicios/pages/servicio-form/servicio-form').then(module => module.ServicioFormPage)
            },
            {
                path: 'catalogos/servicios/:id/editar',
                title: 'Editar servicio | PCR Front V2',
                loadComponent: () => import('./features/servicios/pages/servicio-form/servicio-form').then(module => module.ServicioFormPage)
            },
            {
                path: 'catalogos/servicios',
                title: 'Servicios | PCR Front V2',
                loadComponent: () => import('./features/servicios/pages/servicio-list/servicio-list').then(module => module.ServicioListPage)
            },
            {
                path: 'catalogos/proveedores/nuevo',
                title: 'Nuevo proveedor | PCR Front V2',
                loadComponent: () => import('./features/proveedores/pages/proveedor-form/proveedor-form').then(module => module.ProveedorFormPage)
            },
            {
                path: 'catalogos/proveedores/:id/editar',
                title: 'Editar proveedor | PCR Front V2',
                loadComponent: () => import('./features/proveedores/pages/proveedor-form/proveedor-form').then(module => module.ProveedorFormPage)
            },
            {
                path: 'catalogos/proveedores',
                title: 'Proveedores | PCR Front V2',
                loadComponent: () => import('./features/proveedores/pages/proveedor-list/proveedor-list').then(module => module.ProveedorListPage)
            },
            {
                path: 'inventario/movimientos',
                title: 'Movimientos de inventario | PCR Front V2',
                loadComponent: () => import('./features/inventario/pages/movimiento-list/movimiento-list').then(module => module.MovimientoListPage)
            },
            {
                path: 'productos/nuevo',
                title: 'Nuevo producto | PCR Front V2',
                loadComponent: () => import('./features/productos/pages/producto-form/producto-form').then(module => module.ProductoFormPage)
            },
            {
                path: 'productos/:id/movimiento',
                title: 'Movimiento de inventario | PCR Front V2',
                loadComponent: () => import('./features/inventario/pages/movimiento-form/movimiento-form').then(module => module.MovimientoFormPage)
            },
            {
                path: 'productos/:id/editar',
                title: 'Editar producto | PCR Front V2',
                loadComponent: () => import('./features/productos/pages/producto-form/producto-form').then(module => module.ProductoFormPage)
            },
            {
                path: 'productos/:id',
                title: 'Detalle de producto | PCR Front V2',
                loadComponent: () => import('./features/productos/pages/producto-detail/producto-detail').then(module => module.ProductoDetailPage)
            },
            {
                path: 'productos',
                title: 'Productos | PCR Front V2',
                loadComponent: () => import('./features/productos/pages/producto-list/producto-list').then(module => module.ProductoListPage)
            },
            {
                path: 'servicios/nueva',
                title: 'Nueva solicitud de servicio | PCR Front V2',
                loadComponent: () => import('./features/servicios/pages/solicitud-servicio-form/solicitud-servicio-form').then(module => module.SolicitudServicioFormPage)
            },
            {
                path: 'servicios/:id/editar',
                title: 'Editar solicitud de servicio | PCR Front V2',
                loadComponent: () => import('./features/servicios/pages/solicitud-servicio-form/solicitud-servicio-form').then(module => module.SolicitudServicioFormPage)
            },
            {
                path: 'servicios/:id',
                title: 'Detalle de solicitud de servicio | PCR Front V2',
                loadComponent: () => import('./features/servicios/pages/solicitud-servicio-detail/solicitud-servicio-detail').then(module => module.SolicitudServicioDetailPage)
            },
            {
                path: 'servicios',
                title: 'Servicios | PCR Front V2',
                loadComponent: () => import('./features/servicios/pages/solicitud-servicio-list/solicitud-servicio-list').then(module => module.SolicitudServicioListPage)
            },
            {
                path: 'compras/nueva',
                title: 'Nueva compra | PCR Front V2',
                loadComponent: () => import('./features/compras/pages/compra-form/compra-form').then(module => module.CompraFormPage)
            },
            {
                path: 'compras/:id',
                title: 'Detalle de compra | PCR Front V2',
                loadComponent: () => import('./features/compras/pages/compra-detail/compra-detail').then(module => module.CompraDetailPage)
            },
            {
                path: 'compras',
                title: 'Compras | PCR Front V2',
                loadComponent: () => import('./features/compras/pages/compra-list/compra-list').then(module => module.CompraListPage)
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
                path: 'seguridad/usuarios/nuevo',
                title: 'Nuevo usuario | PCR Front V2',
                canActivate: [roleGuard], data: { roles: [AUTH_ROLE.ADMIN] },
                loadComponent: () => import('./features/usuarios/pages/usuario-form/usuario-form').then(module => module.UsuarioFormPage)
            },
            {
                path: 'seguridad/usuarios/:id/editar',
                title: 'Editar usuario | PCR Front V2',
                canActivate: [roleGuard], data: { roles: [AUTH_ROLE.ADMIN] },
                loadComponent: () => import('./features/usuarios/pages/usuario-form/usuario-form').then(module => module.UsuarioFormPage)
            },
            {
                path: 'seguridad/usuarios',
                title: 'Usuarios | PCR Front V2',
                canActivate: [roleGuard], data: { roles: [AUTH_ROLE.ADMIN] },
                loadComponent: () => import('./features/usuarios/pages/usuario-list/usuario-list').then(module => module.UsuarioListPage)
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