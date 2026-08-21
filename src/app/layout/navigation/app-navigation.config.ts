import { AUTH_ROLE } from '../../core/auth/auth-role.model';
import { NavigationSection } from './navigation-section.model';

export const APP_NAVIGATION: readonly NavigationSection[] = [
    {
        id: 'principal',
        label: 'Principal',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: 'dashboard',
                route: '/dashboard',
                exact: true,
                roles: [AUTH_ROLE.ADMIN]
            }
        ]
    },
    {
        id: 'gestion',
        label: 'Gestión',
        items: [
            {
                id: 'misas',
                label: 'Misas',
                icon: 'church',
                route: '/misas',
                exact: true,
                roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.USER]
            },
            {
                id: 'ventas',
                label: 'Ventas',
                icon: 'point_of_sale',
                route: '/ventas',
                exact: true,
                roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.USER]
            }
        ]
    },
    {
        id: 'inventario',
        label: 'Inventario',
        items: [
            {
                id: 'productos',
                label: 'Productos',
                icon: 'inventory_2',
                route: '/productos',
                exact: true,
                roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.USER]
            },
            {
                id: 'movimientos',
                label: 'Movimientos',
                icon: 'swap_vert',
                route: '/inventario/movimientos',
                exact: true,
                roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.USER]
            }
        ]
    }

];