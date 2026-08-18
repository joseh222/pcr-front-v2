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
                exact: true
            }
        ]
    }
];