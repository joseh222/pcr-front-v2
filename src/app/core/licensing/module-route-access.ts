import { MODULE_CODE, ModuleCode } from './module-code.model';

interface ModuleRouteRule {
    readonly prefix: string;
    readonly modules: readonly ModuleCode[];
}

const MODULE_ROUTE_RULES: readonly ModuleRouteRule[] = [
    { prefix: '/reportes/resumen-economico', modules: [MODULE_CODE.REPORTS, MODULE_CODE.SALES, MODULE_CODE.PURCHASES] },
    { prefix: '/reportes/ventas', modules: [MODULE_CODE.REPORTS, MODULE_CODE.SALES] },
    { prefix: '/reportes/compras', modules: [MODULE_CODE.REPORTS, MODULE_CODE.PURCHASES] },
    { prefix: '/reportes/misas', modules: [MODULE_CODE.REPORTS, MODULE_CODE.MASSES] },
    { prefix: '/sacramentos', modules: [MODULE_CODE.SACRAMENTS] },
    { prefix: '/catalogos/servicios', modules: [MODULE_CODE.SERVICES] },
    { prefix: '/catalogos/proveedores', modules: [MODULE_CODE.PURCHASES] },
    { prefix: '/inventario', modules: [MODULE_CODE.INVENTORY] },
    { prefix: '/productos', modules: [MODULE_CODE.INVENTORY] },
    { prefix: '/servicios', modules: [MODULE_CODE.SERVICES] },
    { prefix: '/compras', modules: [MODULE_CODE.PURCHASES] },
    { prefix: '/ventas', modules: [MODULE_CODE.SALES] },
    { prefix: '/misas', modules: [MODULE_CODE.MASSES] }
];

export function requiredModulesForUrl(url: string): readonly ModuleCode[] {
    const normalized = normalizePath(url);
    return MODULE_ROUTE_RULES.find(rule => normalized === rule.prefix || normalized.startsWith(`${rule.prefix}/`))?.modules ?? [];
}

function normalizePath(url: string): string {
    const path = (url.split('?')[0] ?? '').split('#')[0] ?? '';
    if (!path) return '/';
    const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
    return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, '') : withLeadingSlash;
}
