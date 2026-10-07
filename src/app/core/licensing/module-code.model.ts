export const MODULE_CODE = {
    CORE: 'CORE',
    SALES: 'VENTAS',
    PURCHASES: 'COMPRAS',
    INVENTORY: 'INVENTARIO',
    SERVICES: 'SERVICIOS',
    MASSES: 'MISAS',
    SACRAMENTS: 'SACRAMENTOS',
    REPORTS: 'REPORTES'
} as const;

export type ModuleCode = typeof MODULE_CODE[keyof typeof MODULE_CODE];
