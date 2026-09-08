import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { ConfiguracionInicialStore } from '../../../features/configuracion/data-access/configuracion-inicial.store';
import { ModuleStore } from '../../../features/configuracion/data-access/module.store';
import { initialConfigurationGuard } from './initial-configuration.guard';

describe('initialConfigurationGuard',()=>{
    const authenticated=signal(true);
    const mustChange=signal(false);
    const auth={ isAuthenticated:authenticated.asReadonly(),mustChangePassword:mustChange.asReadonly(),hasPermission:vi.fn(()=>true) };
    const setup={ load:vi.fn() };
    const modules={ load:vi.fn() };

    beforeEach(()=>{
        TestBed.configureTestingModule({
            providers:[
                provideRouter([]),
                {provide:AuthStore,useValue:auth},
                {provide:ConfiguracionInicialStore,useValue:setup},
                {provide:ModuleStore,useValue:modules}
            ]
        });
        authenticated.set(true);
        mustChange.set(false);
        auth.hasPermission.mockReturnValue(true);
        modules.load.mockResolvedValue({licenciaValida:true});
    });

    it('allows normal routes when setup is completed',async()=>{
        setup.load.mockResolvedValue({configuracionInicialCompletada:true});
        const result=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/ventas'} as RouterStateSnapshot)) as any;
        expect(result).toBe(true);
    });

    it('redirects to license while setup is pending and no valid license exists',async()=>{
        setup.load.mockResolvedValue({configuracionInicialCompletada:false});
        modules.load.mockResolvedValue({licenciaValida:false});
        const result=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/ventas'} as RouterStateSnapshot)) as any;
        expect((result as any).toString()).toContain('/configuracion/licencia');
    });

    it('allows only the license route before activation',async()=>{
        setup.load.mockResolvedValue({configuracionInicialCompletada:false});
        modules.load.mockResolvedValue({licenciaValida:false});
        const result=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/configuracion/licencia'} as RouterStateSnapshot)) as any;
        expect(result).toBe(true);
    });

    it('redirects operational routes to wizard after license activation while setup is pending',async()=>{
        setup.load.mockResolvedValue({configuracionInicialCompletada:false});
        modules.load.mockResolvedValue({licenciaValida:true});
        const result=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/ventas'} as RouterStateSnapshot)) as any;
        expect((result as any).toString()).toContain('/configuracion/inicial');
    });

    it('allows setup maintenance routes after license activation',async()=>{
        setup.load.mockResolvedValue({configuracionInicialCompletada:false});
        modules.load.mockResolvedValue({licenciaValida:true});
        const result=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/configuracion/mantenimientos'} as RouterStateSnapshot)) as any;
        expect(result).toBe(true);
    });

    it('allows dashboard and security after license activation while setup is pending',async()=>{
        setup.load.mockResolvedValue({configuracionInicialCompletada:false});
        modules.load.mockResolvedValue({licenciaValida:true});
        const dashboard=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/dashboard'} as RouterStateSnapshot)) as any;
        const security=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/seguridad/usuarios'} as RouterStateSnapshot)) as any;
        expect(dashboard).toBe(true);
        expect(security).toBe(true);
    });
});
