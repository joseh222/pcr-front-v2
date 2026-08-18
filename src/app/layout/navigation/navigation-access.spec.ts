import { AUTH_ROLE } from '../../core/auth/auth-role.model';
import { NavigationSection } from './navigation-section.model';
import { filterNavigationByRole } from './navigation-access';

describe('filterNavigationByRole', () => {
    const navigation: readonly NavigationSection[] = [
        {
            id: 'principal',
            label: 'Principal',
            items: [
                {
                    id: 'dashboard',
                    label: 'Dashboard',
                    icon: 'dashboard',
                    route: '/dashboard'
                },
                {
                    id: 'misas',
                    label: 'Misas',
                    icon: 'church',
                    route: '/misas',
                    roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.USER]
                }
            ]
        },
        {
            id: 'administracion',
            label: 'Administración',
            items: [
                {
                    id: 'usuarios',
                    label: 'Usuarios',
                    icon: 'manage_accounts',
                    route: '/admin/usuarios',
                    roles: [AUTH_ROLE.ADMIN]
                }
            ]
        }
    ];

    it('should allow ADMIN navigation items', () => {
        const result = filterNavigationByRole(
            navigation,
            AUTH_ROLE.ADMIN
        );

        const ids = result.flatMap(section =>
            section.items.map(item => item.id)
        );

        expect(ids).toEqual([
            'dashboard',
            'misas',
            'usuarios'
        ]);
    });

    it('should hide ADMIN navigation items from USER', () => {
        const result = filterNavigationByRole(
            navigation,
            AUTH_ROLE.USER
        );

        const ids = result.flatMap(section =>
            section.items.map(item => item.id)
        );

        expect(ids).toEqual([
            'dashboard',
            'misas'
        ]);

        expect(
            result.some(section => section.id === 'administracion')
        ).toBe(false);
    });

    it('should only expose unrestricted items when role is null', () => {
        const result = filterNavigationByRole(
            navigation,
            null
        );

        const ids = result.flatMap(section =>
            section.items.map(item => item.id)
        );

        expect(ids).toEqual(['dashboard']);
    });

    it('should not mutate the original navigation', () => {
        filterNavigationByRole(
            navigation,
            AUTH_ROLE.USER
        );

        expect(navigation[1].items).toHaveLength(1);
        expect(navigation[1].items[0].id).toBe('usuarios');
    });
});