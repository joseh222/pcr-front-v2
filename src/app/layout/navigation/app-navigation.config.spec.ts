import { AUTH_ROLE } from '../../core/auth/auth-role.model';
import { APP_NAVIGATION } from './app-navigation.config';

describe('APP_NAVIGATION', () => {
    it('should contain unique section and item identifiers', () => {
        const sectionIds = APP_NAVIGATION.map(section => section.id);
        const itemIds = APP_NAVIGATION.flatMap(section => section.items.map(item => item.id));
        expect(new Set(sectionIds).size).toBe(sectionIds.length);
        expect(new Set(itemIds).size).toBe(itemIds.length);
    });

    it('should contain valid navigation configuration', () => {
        APP_NAVIGATION.forEach(section => {
            expect(section.id.trim()).not.toBe(''); expect(section.label.trim()).not.toBe(''); expect(section.items.length).toBeGreaterThan(0);
            section.items.forEach(item => {
                expect(item.id.trim()).not.toBe(''); expect(item.label.trim()).not.toBe(''); expect(item.icon.trim()).not.toBe(''); expect(item.route.startsWith('/')).toBe(true);
            });
        });
    });

    it('should organize main modules in the expected sections', () => {
        const principal = APP_NAVIGATION.find(section => section.id === 'principal');
        const catalogos = APP_NAVIGATION.find(section => section.id === 'catalogos');
        const gestion = APP_NAVIGATION.find(section => section.id === 'gestion');
        const venta = APP_NAVIGATION.find(section => section.id === 'venta');
        const compra = APP_NAVIGATION.find(section => section.id === 'compra');
        const inventario = APP_NAVIGATION.find(section => section.id === 'inventario');

        expect(principal?.items.some(item => item.id === 'dashboard')).toBe(true);
        expect(catalogos?.items).toContainEqual({ id: 'catalogo-servicios', label: 'Servicios', icon: 'design_services', route: '/catalogos/servicios', exact: true, roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.USER] });
        expect(gestion?.items.some(item => item.id === 'misas')).toBe(true);
        expect(gestion?.items.find(item => item.id === 'servicios')?.disabled).toBe(true);
        expect(venta?.items.some(item => item.id === 'ventas')).toBe(true);
        expect(compra?.items.find(item => item.id === 'compras')?.disabled).toBe(true);
        expect(inventario?.items.map(item => item.id)).toEqual(['productos', 'movimientos']);
    });
});
