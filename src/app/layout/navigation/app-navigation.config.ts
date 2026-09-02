import { PERMISSION_CODE } from '../../core/auth/permission-code.model';
import { NavigationSection } from './navigation-section.model';

export const APP_NAVIGATION: readonly NavigationSection[] = [
    {
        id: 'seguridad', label: 'Seguridad', items: [
            { id: 'usuarios', label: 'Usuarios', icon: 'manage_accounts', route: '/seguridad/usuarios', exact: true, permissions: [PERMISSION_CODE.USER_VIEW] },
            { id: 'roles', label: 'Roles y permisos', icon: 'admin_panel_settings', route: '/seguridad/roles', exact: true, permissions: [PERMISSION_CODE.ROLE_VIEW] }
        ]
    },
    { id: 'configuracion', label: 'Configuración', items: [{ id: 'configuracion-general', label: 'Parámetros del sistema', icon: 'settings', route: '/configuracion/impresion', exact: true, permissions: [PERMISSION_CODE.CONFIGURATION_VIEW] }] },
    { id: 'principal', label: 'Principal', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard', exact: true, permissions: [PERMISSION_CODE.DASHBOARD_VIEW] }] },
    {
        id: 'reportes', label: 'Reportes', items: [
            { id: 'reporte-ventas', label: 'Ventas', icon: 'analytics', route: '/reportes/ventas', exact: true, permissions: [PERMISSION_CODE.REPORT_SALES_VIEW] },
            { id: 'reporte-compras', label: 'Compras', icon: 'shopping_cart_checkout', route: '/reportes/compras', exact: true, permissions: [PERMISSION_CODE.REPORT_PURCHASES_VIEW] },
            { id: 'reporte-misas', label: 'Misas', icon: 'church', route: '/reportes/misas', exact: true, permissions: [PERMISSION_CODE.REPORT_MASSES_VIEW] },
            { id: 'resumen-economico', label: 'Resumen económico', icon: 'account_balance_wallet', route: '/reportes/resumen-economico', exact: true, permissions: [PERMISSION_CODE.REPORT_ECONOMIC_SUMMARY_VIEW] }
        ]
    },
    {
        id: 'catalogos', label: 'Catálogos', items: [
            { id: 'catalogo-servicios', label: 'Servicios', icon: 'design_services', route: '/catalogos/servicios', exact: true, permissions: [PERMISSION_CODE.SERVICE_CATALOG_VIEW] },
            { id: 'catalogo-proveedores', label: 'Proveedores', icon: 'local_shipping', route: '/catalogos/proveedores', exact: true, permissions: [PERMISSION_CODE.SUPPLIER_VIEW] }
        ]
    },
    {
        id: 'gestion', label: 'Gestión', items: [
            { id: 'personas', label: 'Personas', icon: 'groups', route: '/personas', exact: true, permissions: [PERMISSION_CODE.PERSON_VIEW] },
            { id: 'misas', label: 'Misas', icon: 'church', route: '/misas', exact: true, permissions: [PERMISSION_CODE.MASS_VIEW] },
            { id: 'servicios', label: 'Servicios', icon: 'assignment', route: '/servicios', exact: true, permissions: [PERMISSION_CODE.SERVICE_REQUEST_VIEW] }
        ]
    },
    { id: 'registros-sacramentales', label: 'Registros sacramentales', items: [
        { id: 'libros-sacramentales', label: 'Libros sacramentales', icon: 'auto_stories', route: '/sacramentos/libros', exact: true, permissions: [PERMISSION_CODE.SACRAMENTAL_BOOK_VIEW] },
        { id: 'bautismos', label: 'Bautismos', icon: 'water_drop', route: '/sacramentos/bautismos', exact: true, permissions: [PERMISSION_CODE.BAPTISM_VIEW] }
    ] },
    { id: 'venta', label: 'Venta', items: [{ id: 'ventas', label: 'Ventas', icon: 'point_of_sale', route: '/ventas', exact: true, permissions: [PERMISSION_CODE.SALE_VIEW] }] },
    { id: 'compra', label: 'Compra', items: [{ id: 'compras', label: 'Compras', icon: 'shopping_cart', route: '/compras', exact: true, permissions: [PERMISSION_CODE.PURCHASE_VIEW] }] },
    {
        id: 'inventario', label: 'Inventario', items: [
            { id: 'productos', label: 'Productos', icon: 'inventory_2', route: '/productos', exact: true, permissions: [PERMISSION_CODE.PRODUCT_VIEW] },
            { id: 'movimientos', label: 'Movimientos', icon: 'swap_vert', route: '/inventario/movimientos', exact: true, permissions: [PERMISSION_CODE.INVENTORY_VIEW] }
        ]
    }
];
