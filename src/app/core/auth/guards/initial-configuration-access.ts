export const INITIAL_CONFIGURATION_ALLOWED_PREFIXES = [
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

export function isInitialConfigurationRouteAllowed(url: string): boolean {
    return INITIAL_CONFIGURATION_ALLOWED_PREFIXES.some(prefix => url.startsWith(prefix));
}
