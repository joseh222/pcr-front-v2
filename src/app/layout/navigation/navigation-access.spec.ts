import { AUTH_ROLE } from '../../core/auth/auth-role.model';
import { PERMISSION_CODE } from '../../core/auth/permission-code.model';
import { NavigationSection } from './navigation-section.model';
import { filterNavigationByAccess } from './navigation-access';

describe('filterNavigationByAccess', () => {
    const navigation: readonly NavigationSection[] = [
        { id: 'legacy', label: 'Legado', items: [{ id: 'misas', label: 'Misas', icon: 'church', route: '/misas', roles: [AUTH_ROLE.ADMIN, AUTH_ROLE.USER] }] },
        { id: 'seguridad', label: 'Seguridad', items: [{ id: 'usuarios', label: 'Usuarios', icon: 'manage_accounts', route: '/seguridad/usuarios', permissions: [PERMISSION_CODE.USER_VIEW] }, { id: 'roles', label: 'Roles', icon: 'shield', route: '/seguridad/roles', permissions: [PERMISSION_CODE.ROLE_VIEW] }] }
    ];
    it('should keep legacy role navigation during migration', () => { const ids = filterNavigationByAccess(navigation, AUTH_ROLE.USER, []).flatMap(section => section.items.map(item => item.id)); expect(ids).toEqual(['misas']); });
    it('should expose security navigation by permission regardless of legacy role', () => { const ids = filterNavigationByAccess(navigation, AUTH_ROLE.USER, [PERMISSION_CODE.USER_VIEW]).flatMap(section => section.items.map(item => item.id)); expect(ids).toEqual(['misas', 'usuarios']); });
    it('should allow all permission items when grantsAllPermissions is true', () => { const ids = filterNavigationByAccess(navigation, AUTH_ROLE.ADMIN, [], true).flatMap(section => section.items.map(item => item.id)); expect(ids).toEqual(['misas', 'usuarios', 'roles']); });
    it('should not mutate original navigation', () => { filterNavigationByAccess(navigation, AUTH_ROLE.USER, []); expect(navigation[1].items).toHaveLength(2); });
});
