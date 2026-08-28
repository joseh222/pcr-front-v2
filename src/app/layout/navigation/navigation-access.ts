import { AuthRole } from '../../core/auth/auth-role.model';
import { NavigationSection } from './navigation-section.model';

export function filterNavigationByAccess(sections: readonly NavigationSection[], role: AuthRole | null, permissions: readonly string[], grantsAllPermissions = false): readonly NavigationSection[] {
    const granted = new Set(permissions.map(value => value.trim().toUpperCase()));
    return sections.map(section => ({ ...section, items: section.items.filter(item => {
        const roleAllowed = !item.roles?.length || (!!role && item.roles.includes(role));
        const permissionAllowed = !item.permissions?.length || grantsAllPermissions || item.permissions.every(permission => granted.has(permission));
        return roleAllowed && permissionAllowed;
    }) })).filter(section => section.items.length > 0);
}
