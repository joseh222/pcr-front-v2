import { AUTH_ROLE } from '../../core/auth/auth-role.model';
import { APP_NAVIGATION } from './app-navigation.config';

describe('APP_NAVIGATION', () => {
    it('should contain unique section identifiers', () => {
        const ids = APP_NAVIGATION.map(section => section.id);

        expect(new Set(ids).size).toBe(ids.length);
    });

    it('should contain unique navigation item identifiers', () => {
        const ids = APP_NAVIGATION.flatMap(section =>
            section.items.map(item => item.id)
        );

        expect(new Set(ids).size).toBe(ids.length);
    });

    it('should contain valid sections', () => {
        APP_NAVIGATION.forEach(section => {
            expect(section.id.trim()).not.toBe('');
            expect(section.label.trim()).not.toBe('');
            expect(section.items.length).toBeGreaterThan(0);
        });
    });

    it('should contain valid navigation items', () => {
        APP_NAVIGATION
            .flatMap(section => section.items)
            .forEach(item => {
                expect(item.id.trim()).not.toBe('');
                expect(item.label.trim()).not.toBe('');
                expect(item.icon.trim()).not.toBe('');
                expect(item.route.startsWith('/')).toBe(true);
            });
    });

    it('should contain the dashboard in the principal section', () => {
        const principal = APP_NAVIGATION.find(
            section => section.id === 'principal'
        );

        expect(principal).toBeTruthy();

        expect(principal?.items).toContainEqual({
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/dashboard',
            exact: true,
            roles: [AUTH_ROLE.ADMIN]
        });
    });

    it('should contain misas in the gestion section', () => {
        const gestion = APP_NAVIGATION.find(
            section => section.id === 'gestion'
        );

        expect(gestion).toBeTruthy();

        expect(gestion?.items).toContainEqual({
            id: 'misas',
            label: 'Misas',
            icon: 'church',
            route: '/misas',
            exact: true,
            roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.USER]
        });
    });

    it('should contain ventas in the gestion section', () => {
        const gestion = APP_NAVIGATION.find(section => section.id === 'gestion');

        expect(gestion?.items).toContainEqual({
            id: 'ventas',
            label: 'Ventas',
            icon: 'point_of_sale',
            route: '/ventas',
            exact: true,
            roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.USER]
        });
    });
});