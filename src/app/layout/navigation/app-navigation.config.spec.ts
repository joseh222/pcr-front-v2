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
            exact: true
        });
    });
});