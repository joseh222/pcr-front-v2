export const PRE_LICENSE_ALLOWED_PREFIXES = [
    '/configuracion/licencia',
    '/forbidden'
] as const;

export const INITIAL_SETUP_ALLOWED_PREFIXES = [
    '/dashboard',
    '/configuracion/inicial',
    '/configuracion/licencia',
    '/configuracion/mantenimientos',
    '/configuracion/impresion',
    '/catalogos/servicios',
    '/seguridad/usuarios',
    '/seguridad/roles',
    '/module-unavailable',
    '/forbidden'
] as const;

export const INITIAL_SETUP_VISIBLE_PREFIXES = [
    '/dashboard',
    '/configuracion/inicial',
    '/configuracion/licencia',
    '/configuracion/mantenimientos',
    '/configuracion/impresion',
    '/seguridad/usuarios',
    '/seguridad/roles'
] as const;

export function isPreLicenseRouteAllowed(url: string): boolean {
    return PRE_LICENSE_ALLOWED_PREFIXES.some(prefix => url.startsWith(prefix));
}

export function isInitialConfigurationRouteAllowed(url: string, licenseValid = true): boolean {
    const prefixes = licenseValid ? INITIAL_SETUP_ALLOWED_PREFIXES : PRE_LICENSE_ALLOWED_PREFIXES;
    return prefixes.some(prefix => url.startsWith(prefix));
}

export function isInitialConfigurationNavigationVisible(url: string, licenseValid: boolean): boolean {
    const prefixes = licenseValid ? INITIAL_SETUP_VISIBLE_PREFIXES : ['/configuracion/licencia'];
    return prefixes.some(prefix => url.startsWith(prefix));
}
