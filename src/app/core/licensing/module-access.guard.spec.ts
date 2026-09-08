import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModuleStore } from '../../features/configuracion/data-access/module.store';
import { MODULE_CODE } from './module-code.model';
import { moduleAccessGuard } from './module-access.guard';

describe('moduleAccessGuard', () => {
    const enabled = new Set<string>();
    const moduleStore = {
        load: vi.fn(async () => ({})),
        isEnabled: vi.fn((code: string) => enabled.has(code))
    };

    beforeEach(() => {
        enabled.clear();
        moduleStore.load.mockClear();
        moduleStore.isEnabled.mockClear();
        TestBed.configureTestingModule({
            providers: [provideRouter([]), { provide: ModuleStore, useValue: moduleStore }]
        });
    });

    it('allows core routes without consulting the license', async () => {
        const result = await TestBed.runInInjectionContext(() => moduleAccessGuard({} as ActivatedRouteSnapshot, { url: '/personas' } as RouterStateSnapshot)) as any;
        expect(result).toBe(true);
        expect(moduleStore.load).not.toHaveBeenCalled();
    });

    it('allows a licensed commercial route', async () => {
        enabled.add(MODULE_CODE.SALES);
        const result = await TestBed.runInInjectionContext(() => moduleAccessGuard({} as ActivatedRouteSnapshot, { url: '/ventas' } as RouterStateSnapshot)) as any;
        expect(result).toBe(true);
    });

    it('redirects an unlicensed route', async () => {
        const result = await TestBed.runInInjectionContext(() => moduleAccessGuard({} as ActivatedRouteSnapshot, { url: '/compras' } as RouterStateSnapshot)) as any;
        expect(result.toString()).toContain('/module-unavailable');
        expect(result.toString()).toContain('COMPRAS');
    });

    it('requires both REPORTES and VENTAS for the sales report', async () => {
        enabled.add(MODULE_CODE.REPORTS);
        const result = await TestBed.runInInjectionContext(() => moduleAccessGuard({} as ActivatedRouteSnapshot, { url: '/reportes/ventas' } as RouterStateSnapshot)) as any;
        expect(result.toString()).toContain('VENTAS');
    });
});
