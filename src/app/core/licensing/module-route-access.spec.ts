import { describe, expect, it } from 'vitest';
import { MODULE_CODE } from './module-code.model';
import { requiredModulesForUrl } from './module-route-access';

describe('requiredModulesForUrl', () => {
    it('keeps core routes outside commercial licensing', () => {
        expect(requiredModulesForUrl('/personas')).toEqual([]);
        expect(requiredModulesForUrl('/dashboard')).toEqual([]);
        expect(requiredModulesForUrl('/configuracion/licencia')).toEqual([]);
    });

    it('maps operational routes to their commercial module', () => {
        expect(requiredModulesForUrl('/ventas/nueva')).toEqual([MODULE_CODE.SALES]);
        expect(requiredModulesForUrl('/compras/10')).toEqual([MODULE_CODE.PURCHASES]);
        expect(requiredModulesForUrl('/misas')).toEqual([MODULE_CODE.MASSES]);
        expect(requiredModulesForUrl('/sacramentos/bautismos')).toEqual([MODULE_CODE.SACRAMENTS]);
    });

    it('requires reports plus the source module', () => {
        expect(requiredModulesForUrl('/reportes/ventas')).toEqual([MODULE_CODE.REPORTS, MODULE_CODE.SALES]);
        expect(requiredModulesForUrl('/reportes/misas?desde=2026-09-01')).toEqual([MODULE_CODE.REPORTS, MODULE_CODE.MASSES]);
    });
});
