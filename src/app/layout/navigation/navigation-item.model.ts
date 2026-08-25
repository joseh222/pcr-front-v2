import { AuthRole } from '../../core/auth/auth-role.model';

export interface NavigationItem {
    readonly id: string;
    readonly label: string;
    readonly icon: string;
    readonly route: string;
    readonly exact?: boolean;
    readonly disabled?: boolean;
    readonly roles?: readonly AuthRole[];
}