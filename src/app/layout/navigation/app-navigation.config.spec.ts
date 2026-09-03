import { PERMISSION_CODE } from '../../core/auth/permission-code.model';
import { APP_NAVIGATION } from './app-navigation.config';

describe('APP_NAVIGATION', () => {
    it('should contain unique section and item identifiers', () => { const sectionIds = APP_NAVIGATION.map(section => section.id); const itemIds = APP_NAVIGATION.flatMap(section => section.items.map(item => item.id)); expect(new Set(sectionIds).size).toBe(sectionIds.length); expect(new Set(itemIds).size).toBe(itemIds.length); });
    it('should contain valid permission-based navigation configuration', () => { APP_NAVIGATION.forEach(section => { expect(section.id.trim()).not.toBe(''); expect(section.items.length).toBeGreaterThan(0); section.items.forEach(item => { expect(item.route.startsWith('/')).toBe(true); expect(item.permissions?.length).toBeGreaterThan(0); expect(item.roles?.length ?? 0).toBe(0); }); }); });
    it('should map every visible module to its view permission', () => {
        const items = new Map(APP_NAVIGATION.flatMap(section => section.items.map(item => [item.id, item] as const)));
        expect(items.get('dashboard')?.permissions).toEqual([PERMISSION_CODE.DASHBOARD_VIEW]);
        expect(items.get('reporte-ventas')?.permissions).toEqual([PERMISSION_CODE.REPORT_SALES_VIEW]);
        expect(items.get('reporte-compras')?.permissions).toEqual([PERMISSION_CODE.REPORT_PURCHASES_VIEW]);
        expect(items.get('reporte-misas')?.permissions).toEqual([PERMISSION_CODE.REPORT_MASSES_VIEW]);
        expect(items.get('resumen-economico')?.permissions).toEqual([PERMISSION_CODE.REPORT_ECONOMIC_SUMMARY_VIEW]);
        expect(items.get('personas')?.permissions).toEqual([PERMISSION_CODE.PERSON_VIEW]);
        expect(items.get('misas')?.permissions).toEqual([PERMISSION_CODE.MASS_VIEW]);
        expect(items.get('catalogo-servicios')?.permissions).toEqual([PERMISSION_CODE.SERVICE_CATALOG_VIEW]);
        expect(items.get('servicios')?.permissions).toEqual([PERMISSION_CODE.SERVICE_REQUEST_VIEW]);
        expect(items.get('ventas')?.permissions).toEqual([PERMISSION_CODE.SALE_VIEW]);
        expect(items.get('compras')?.permissions).toEqual([PERMISSION_CODE.PURCHASE_VIEW]);
        expect(items.get('productos')?.permissions).toEqual([PERMISSION_CODE.PRODUCT_VIEW]);
        expect(items.get('movimientos')?.permissions).toEqual([PERMISSION_CODE.INVENTORY_VIEW]);
        expect(items.get('catalogo-proveedores')?.permissions).toEqual([PERMISSION_CODE.SUPPLIER_VIEW]);
        expect(items.get('usuarios')?.permissions).toEqual([PERMISSION_CODE.USER_VIEW]);
        expect(items.get('roles')?.permissions).toEqual([PERMISSION_CODE.ROLE_VIEW]);
        expect(items.get('configuracion-general')?.permissions).toEqual([PERMISSION_CODE.CONFIGURATION_VIEW]);
        expect(items.get('libros-sacramentales')?.permissions).toEqual([PERMISSION_CODE.SACRAMENTAL_BOOK_VIEW]);
        expect(items.get('bautismos')?.permissions).toEqual([PERMISSION_CODE.BAPTISM_VIEW]);
        expect(items.get('confirmaciones')?.permissions).toEqual([PERMISSION_CODE.CONFIRMATION_VIEW]);
        expect(items.get('matrimonios')?.permissions).toEqual([PERMISSION_CODE.MARRIAGE_VIEW]);
    });
    it('should place security, configuration, dashboard and reports in the expected order', () => { expect(APP_NAVIGATION[0]?.id).toBe('seguridad'); expect(APP_NAVIGATION[1]?.id).toBe('configuracion'); expect(APP_NAVIGATION[2]?.id).toBe('principal'); expect(APP_NAVIGATION[3]?.id).toBe('reportes'); });
});
