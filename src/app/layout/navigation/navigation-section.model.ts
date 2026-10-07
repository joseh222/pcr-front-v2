import { NavigationItem } from './navigation-item.model';

export interface NavigationSection {
    readonly id: string;
    readonly label: string;
    readonly items: readonly NavigationItem[];
}