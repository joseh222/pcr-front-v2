import { AuthRole } from '../../core/auth/auth-role.model';
import { NavigationSection } from './navigation-section.model';

export function filterNavigationByRole(
    sections: readonly NavigationSection[],
    role: AuthRole | null
): readonly NavigationSection[] {
    return sections
        .map(section => ({
            ...section,
            items: section.items.filter(item =>
                !item.roles?.length ||
                (!!role && item.roles.includes(role))
            )
        }))
        .filter(section => section.items.length > 0);
}