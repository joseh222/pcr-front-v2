import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guards/guest.guard';
import { authGuard } from './core/auth/guards/auth.guard';
import { passwordChangeRequiredGuard } from './core/auth/guards/password-change-required.guard';
import { permissionGuard } from './core/auth/guards/permission.guard';
import { PERMISSION_CODE } from './core/auth/permission-code.model';

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
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.DASHBOARD_VIEW] },
                loadComponent: () => import('./features/dashboard/pages/dashboard').then(module => module.DashboardPage)
            },
            {
                path: 'configuracion/impresion',
                title: 'Configuración de impresión | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.CONFIGURATION_VIEW] },
                loadComponent: () => import('./features/configuracion/pages/configuracion-impresion/configuracion-impresion').then(module => module.ConfiguracionImpresionPage)
            },
            {
                path: 'reportes/ventas',
                title: 'Reporte de ventas | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.REPORT_SALES_VIEW] },
                loadComponent: () => import('./features/reportes/ventas/pages/reporte-ventas/reporte-ventas').then(module => module.ReporteVentasPage)
            },
            {
                path: 'reportes/compras',
                title: 'Reporte de compras | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.REPORT_PURCHASES_VIEW] },
                loadComponent: () => import('./features/reportes/compras/pages/reporte-compras/reporte-compras').then(module => module.ReporteComprasPage)
            },
            {
                path: 'reportes/misas',
                title: 'Reporte de misas | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.REPORT_MASSES_VIEW] },
                loadComponent: () => import('./features/reportes/misas/pages/reporte-misas/reporte-misas').then(module => module.ReporteMisasPage)
            },
            {
                path: 'reportes/resumen-economico',
                title: 'Resumen económico | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.REPORT_ECONOMIC_SUMMARY_VIEW] },
                loadComponent: () => import('./features/reportes/resumen-economico/pages/resumen-economico/resumen-economico').then(module => module.ResumenEconomicoPage)
            },
            {
                path: 'sacramentos/bautismos/nuevo',
                title: 'Nueva partida de bautismo | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.BAPTISM_VIEW, PERMISSION_CODE.BAPTISM_CREATE] },
                loadComponent: () => import('./features/sacramentos/bautismos/pages/bautismo-form/bautismo-form').then(module => module.BautismoFormPage)
            },
            {
                path: 'sacramentos/bautismos/:id/editar',
                title: 'Editar partida de bautismo | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.BAPTISM_VIEW, PERMISSION_CODE.BAPTISM_EDIT] },
                loadComponent: () => import('./features/sacramentos/bautismos/pages/bautismo-form/bautismo-form').then(module => module.BautismoFormPage)
            },
            {
                path: 'sacramentos/bautismos/:id',
                title: 'Detalle de bautismo | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.BAPTISM_VIEW] },
                loadComponent: () => import('./features/sacramentos/bautismos/pages/bautismo-detail/bautismo-detail').then(module => module.BautismoDetailPage)
            },
            {
                path: 'sacramentos/bautismos',
                title: 'Bautismos | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.BAPTISM_VIEW] },
                loadComponent: () => import('./features/sacramentos/bautismos/pages/bautismo-list/bautismo-list').then(module => module.BautismoListPage)
            },
            { path: 'sacramentos/confirmaciones/nuevo', title: 'Nueva partida de confirmación | PCR Front V2', canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.CONFIRMATION_VIEW, PERMISSION_CODE.CONFIRMATION_CREATE] }, loadComponent: () => import('./features/sacramentos/confirmaciones/pages/confirmacion-form/confirmacion-form').then(module => module.ConfirmacionFormPage) },
            { path: 'sacramentos/confirmaciones/:id/editar', title: 'Editar partida de confirmación | PCR Front V2', canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.CONFIRMATION_VIEW, PERMISSION_CODE.CONFIRMATION_EDIT] }, loadComponent: () => import('./features/sacramentos/confirmaciones/pages/confirmacion-form/confirmacion-form').then(module => module.ConfirmacionFormPage) },
            { path: 'sacramentos/confirmaciones/:id', title: 'Detalle de confirmación | PCR Front V2', canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.CONFIRMATION_VIEW] }, loadComponent: () => import('./features/sacramentos/confirmaciones/pages/confirmacion-detail/confirmacion-detail').then(module => module.ConfirmacionDetailPage) },
            { path: 'sacramentos/confirmaciones', title: 'Confirmaciones | PCR Front V2', canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.CONFIRMATION_VIEW] }, loadComponent: () => import('./features/sacramentos/confirmaciones/pages/confirmacion-list/confirmacion-list').then(module => module.ConfirmacionListPage) },
            { path: 'sacramentos/matrimonios/nuevo', title: 'Nueva partida de matrimonio | PCR Front V2', canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.MARRIAGE_VIEW, PERMISSION_CODE.MARRIAGE_CREATE] }, loadComponent: () => import('./features/sacramentos/matrimonios/pages/matrimonio-form/matrimonio-form').then(module => module.MatrimonioFormPage) },
            { path: 'sacramentos/matrimonios/:id/editar', title: 'Editar partida de matrimonio | PCR Front V2', canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.MARRIAGE_VIEW, PERMISSION_CODE.MARRIAGE_EDIT] }, loadComponent: () => import('./features/sacramentos/matrimonios/pages/matrimonio-form/matrimonio-form').then(module => module.MatrimonioFormPage) },
            { path: 'sacramentos/matrimonios/:id', title: 'Detalle de matrimonio | PCR Front V2', canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.MARRIAGE_VIEW] }, loadComponent: () => import('./features/sacramentos/matrimonios/pages/matrimonio-detail/matrimonio-detail').then(module => module.MatrimonioDetailPage) },
            { path: 'sacramentos/matrimonios', title: 'Matrimonios | PCR Front V2', canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.MARRIAGE_VIEW] }, loadComponent: () => import('./features/sacramentos/matrimonios/pages/matrimonio-list/matrimonio-list').then(module => module.MatrimonioListPage) },
            {
                path: 'sacramentos/libros/nuevo',
                title: 'Nuevo libro sacramental | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SACRAMENTAL_BOOK_VIEW, PERMISSION_CODE.SACRAMENTAL_BOOK_CREATE] },
                loadComponent: () => import('./features/sacramentos/libros/pages/libro-form/libro-form').then(module => module.LibroSacramentalFormPage)
            },
            {
                path: 'sacramentos/libros/:id/editar',
                title: 'Editar libro sacramental | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SACRAMENTAL_BOOK_VIEW, PERMISSION_CODE.SACRAMENTAL_BOOK_EDIT] },
                loadComponent: () => import('./features/sacramentos/libros/pages/libro-form/libro-form').then(module => module.LibroSacramentalFormPage)
            },
            {
                path: 'sacramentos/libros/:id',
                title: 'Libro sacramental | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SACRAMENTAL_BOOK_VIEW] },
                loadComponent: () => import('./features/sacramentos/libros/pages/libro-detail/libro-detail').then(module => module.LibroSacramentalDetailPage)
            },
            {
                path: 'sacramentos/libros',
                title: 'Libros sacramentales | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SACRAMENTAL_BOOK_VIEW] },
                loadComponent: () => import('./features/sacramentos/libros/pages/libro-list/libro-list').then(module => module.LibroSacramentalListPage)
            },
            {
                path: 'personas/nueva',
                title: 'Nueva persona | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PERSON_VIEW, PERMISSION_CODE.PERSON_CREATE] },
                loadComponent: () => import('./features/personas/pages/persona-form/persona-form').then(module => module.PersonaFormPage)
            },
            {
                path: 'personas/:id/editar',
                title: 'Editar persona | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PERSON_VIEW, PERMISSION_CODE.PERSON_EDIT] },
                loadComponent: () => import('./features/personas/pages/persona-form/persona-form').then(module => module.PersonaFormPage)
            },
            {
                path: 'personas/:id',
                title: 'Detalle de persona | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PERSON_VIEW] },
                loadComponent: () => import('./features/personas/pages/persona-detail/persona-detail').then(module => module.PersonaDetailPage)
            },
            {
                path: 'personas',
                title: 'Personas | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PERSON_VIEW] },
                loadComponent: () => import('./features/personas/pages/persona-list/persona-list').then(module => module.PersonaListPage)
            },
            {
                path: 'catalogos/servicios/nuevo',
                title: 'Nuevo servicio | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SERVICE_CATALOG_VIEW, PERMISSION_CODE.SERVICE_CATALOG_CREATE] },
                loadComponent: () => import('./features/servicios/pages/servicio-form/servicio-form').then(module => module.ServicioFormPage)
            },
            {
                path: 'catalogos/servicios/:id/editar',
                title: 'Editar servicio | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SERVICE_CATALOG_VIEW, PERMISSION_CODE.SERVICE_CATALOG_EDIT] },
                loadComponent: () => import('./features/servicios/pages/servicio-form/servicio-form').then(module => module.ServicioFormPage)
            },
            {
                path: 'catalogos/servicios',
                title: 'Servicios | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SERVICE_CATALOG_VIEW] },
                loadComponent: () => import('./features/servicios/pages/servicio-list/servicio-list').then(module => module.ServicioListPage)
            },
            {
                path: 'catalogos/proveedores/nuevo',
                title: 'Nuevo proveedor | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SUPPLIER_VIEW, PERMISSION_CODE.SUPPLIER_CREATE] },
                loadComponent: () => import('./features/proveedores/pages/proveedor-form/proveedor-form').then(module => module.ProveedorFormPage)
            },
            {
                path: 'catalogos/proveedores/:id/editar',
                title: 'Editar proveedor | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SUPPLIER_VIEW, PERMISSION_CODE.SUPPLIER_EDIT] },
                loadComponent: () => import('./features/proveedores/pages/proveedor-form/proveedor-form').then(module => module.ProveedorFormPage)
            },
            {
                path: 'catalogos/proveedores',
                title: 'Proveedores | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SUPPLIER_VIEW] },
                loadComponent: () => import('./features/proveedores/pages/proveedor-list/proveedor-list').then(module => module.ProveedorListPage)
            },
            {
                path: 'inventario/movimientos',
                title: 'Movimientos de inventario | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.INVENTORY_VIEW] },
                loadComponent: () => import('./features/inventario/pages/movimiento-list/movimiento-list').then(module => module.MovimientoListPage)
            },
            {
                path: 'productos/nuevo',
                title: 'Nuevo producto | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PRODUCT_VIEW, PERMISSION_CODE.PRODUCT_CREATE] },
                loadComponent: () => import('./features/productos/pages/producto-form/producto-form').then(module => module.ProductoFormPage)
            },
            {
                path: 'productos/:id/movimiento',
                title: 'Movimiento de inventario | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.INVENTORY_VIEW, PERMISSION_CODE.INVENTORY_MOVEMENT_CREATE] },
                loadComponent: () => import('./features/inventario/pages/movimiento-form/movimiento-form').then(module => module.MovimientoFormPage)
            },
            {
                path: 'productos/:id/editar',
                title: 'Editar producto | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PRODUCT_VIEW, PERMISSION_CODE.PRODUCT_EDIT] },
                loadComponent: () => import('./features/productos/pages/producto-form/producto-form').then(module => module.ProductoFormPage)
            },
            {
                path: 'productos/:id',
                title: 'Detalle de producto | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PRODUCT_VIEW] },
                loadComponent: () => import('./features/productos/pages/producto-detail/producto-detail').then(module => module.ProductoDetailPage)
            },
            {
                path: 'productos',
                title: 'Productos | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PRODUCT_VIEW] },
                loadComponent: () => import('./features/productos/pages/producto-list/producto-list').then(module => module.ProductoListPage)
            },
            {
                path: 'servicios/nueva',
                title: 'Nueva solicitud de servicio | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SERVICE_REQUEST_VIEW, PERMISSION_CODE.SERVICE_REQUEST_CREATE] },
                loadComponent: () => import('./features/servicios/pages/solicitud-servicio-form/solicitud-servicio-form').then(module => module.SolicitudServicioFormPage)
            },
            {
                path: 'servicios/:id/editar',
                title: 'Editar solicitud de servicio | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SERVICE_REQUEST_VIEW, PERMISSION_CODE.SERVICE_REQUEST_EDIT] },
                loadComponent: () => import('./features/servicios/pages/solicitud-servicio-form/solicitud-servicio-form').then(module => module.SolicitudServicioFormPage)
            },
            {
                path: 'servicios/:id',
                title: 'Detalle de solicitud de servicio | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SERVICE_REQUEST_VIEW] },
                loadComponent: () => import('./features/servicios/pages/solicitud-servicio-detail/solicitud-servicio-detail').then(module => module.SolicitudServicioDetailPage)
            },
            {
                path: 'servicios',
                title: 'Servicios | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SERVICE_REQUEST_VIEW] },
                loadComponent: () => import('./features/servicios/pages/solicitud-servicio-list/solicitud-servicio-list').then(module => module.SolicitudServicioListPage)
            },
            {
                path: 'compras/nueva',
                title: 'Nueva compra | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PURCHASE_VIEW, PERMISSION_CODE.PURCHASE_CREATE] },
                loadComponent: () => import('./features/compras/pages/compra-form/compra-form').then(module => module.CompraFormPage)
            },
            {
                path: 'compras/:id',
                title: 'Detalle de compra | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PURCHASE_VIEW] },
                loadComponent: () => import('./features/compras/pages/compra-detail/compra-detail').then(module => module.CompraDetailPage)
            },
            {
                path: 'compras',
                title: 'Compras | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.PURCHASE_VIEW] },
                loadComponent: () => import('./features/compras/pages/compra-list/compra-list').then(module => module.CompraListPage)
            },
            {
                path: 'ventas/nueva',
                title: 'Nueva venta | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SALE_VIEW, PERMISSION_CODE.SALE_CREATE] },
                loadComponent: () => import('./features/ventas/pages/venta-form/venta-form').then(module => module.VentaFormPage)
            },
            {
                path: 'ventas/:id',
                title: 'Detalle de venta | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SALE_VIEW] },
                loadComponent: () => import('./features/ventas/pages/venta-detail/venta-detail').then(module => module.VentaDetailPage)
            },
            {
                path: 'ventas',
                title: 'Ventas | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.SALE_VIEW] },
                loadComponent: () => import('./features/ventas/pages/venta-list/venta-list').then(module => module.VentaListPage)
            },
            {
                path: 'misas/nueva',
                title: 'Nueva misa | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.MASS_VIEW, PERMISSION_CODE.MASS_CREATE] },
                loadComponent: () => import('./features/misas/pages/misa-form/misa-form').then(module => module.MisaFormPage)
            },
            {
                path: 'misas/:id/editar',
                title: 'Editar misa | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.MASS_VIEW, PERMISSION_CODE.MASS_EDIT] },
                loadComponent: () => import('./features/misas/pages/misa-form/misa-form').then(module => module.MisaFormPage)
            },
            {
                path: 'misas',
                title: 'Misas | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.MASS_VIEW] },
                loadComponent: () => import('./features/misas/pages/misa-list/misa-list').then(module => module.MisaListPage)
            },
            {
                path: 'seguridad/usuarios/nuevo',
                title: 'Nuevo usuario | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.USER_VIEW, PERMISSION_CODE.USER_CREATE, PERMISSION_CODE.USER_ASSIGN_ROLES] },
                loadComponent: () => import('./features/usuarios/pages/usuario-form/usuario-form').then(module => module.UsuarioFormPage)
            },
            {
                path: 'seguridad/usuarios/:id/editar',
                title: 'Editar usuario | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.USER_VIEW, PERMISSION_CODE.USER_EDIT] },
                loadComponent: () => import('./features/usuarios/pages/usuario-form/usuario-form').then(module => module.UsuarioFormPage)
            },
            {
                path: 'seguridad/usuarios',
                title: 'Usuarios | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.USER_VIEW] },
                loadComponent: () => import('./features/usuarios/pages/usuario-list/usuario-list').then(module => module.UsuarioListPage)
            },
            {
                path: 'seguridad/roles/nuevo',
                title: 'Nuevo rol | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.ROLE_VIEW, PERMISSION_CODE.ROLE_CREATE] },
                loadComponent: () => import('./features/roles/pages/rol-form/rol-form').then(module => module.RolFormPage)
            },
            {
                path: 'seguridad/roles/:id/editar',
                title: 'Rol y permisos | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.ROLE_VIEW] },
                loadComponent: () => import('./features/roles/pages/rol-form/rol-form').then(module => module.RolFormPage)
            },
            {
                path: 'seguridad/roles',
                title: 'Roles y permisos | PCR Front V2',
                canActivate: [permissionGuard], data: { permissions: [PERMISSION_CODE.ROLE_VIEW] },
                loadComponent: () => import('./features/roles/pages/rol-list/rol-list').then(module => module.RolListPage)
            },
            {
                path: 'forbidden',
                title: 'Acceso restringido | PCR Front V2',
                loadComponent: () => import('./shared/pages/forbidden/forbidden').then(module => module.ForbiddenPage)
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