import { AUTH_ROLE } from '../../core/auth/auth-role.model';
import { PERMISSION_CODE } from '../../core/auth/permission-code.model';
import { NavigationSection } from './navigation-section.model';
import { filterNavigationByAccess } from './navigation-access';

describe('filterNavigationByAccess', () => {
    const navigation: readonly NavigationSection[] = [
        { id: 'principal', label: 'Principal', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard', permissions: [PERMISSION_CODE.DASHBOARD_VIEW] }] },
        { id: 'seguridad', label: 'Seguridad', items: [{ id: 'usuarios', label: 'Usuarios', icon: 'manage_accounts', route: '/seguridad/usuarios', permissions: [PERMISSION_CODE.USER_VIEW] }, { id: 'roles', label: 'Roles', icon: 'shield', route: '/seguridad/roles', permissions: [PERMISSION_CODE.ROLE_VIEW] }] }
    ];
    it('should expose only items allowed by permissions', () => { const ids = filterNavigationByAccess(navigation, AUTH_ROLE.USER, [PERMISSION_CODE.USER_VIEW]).flatMap(section => section.items.map(item => item.id)); expect(ids).toEqual(['usuarios']); });
    it('should expose multiple modules when their permissions are assigned', () => { const ids = filterNavigationByAccess(navigation, null, [PERMISSION_CODE.DASHBOARD_VIEW, PERMISSION_CODE.ROLE_VIEW]).flatMap(section => section.items.map(item => item.id)); expect(ids).toEqual(['dashboard', 'roles']); });
    it('should allow all permission items when grantsAllPermissions is true', () => { const ids = filterNavigationByAccess(navigation, AUTH_ROLE.ADMIN, [], true).flatMap(section => section.items.map(item => item.id)); expect(ids).toEqual(['dashboard', 'usuarios', 'roles']); });
    it('should not mutate original navigation', () => { filterNavigationByAccess(navigation, AUTH_ROLE.USER, []); expect(navigation[1].items).toHaveLength(2); });
});
