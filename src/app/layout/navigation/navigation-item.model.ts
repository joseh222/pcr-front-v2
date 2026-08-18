export interface NavigationItem {
    readonly id: string;
    readonly label: string;
    readonly icon: string;
    readonly route: string;
    readonly exact?: boolean;
}