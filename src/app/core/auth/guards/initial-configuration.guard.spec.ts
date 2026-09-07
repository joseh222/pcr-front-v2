import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { ConfiguracionInicialStore } from '../../../features/configuracion/data-access/configuracion-inicial.store';
import { initialConfigurationGuard } from './initial-configuration.guard';

describe('initialConfigurationGuard',()=>{
    const authenticated=signal(true); const mustChange=signal(false);
    const auth={ isAuthenticated:authenticated.asReadonly(),mustChangePassword:mustChange.asReadonly(),hasPermission:vi.fn(()=>true) };
    const setup={ load:vi.fn() };
    beforeEach(()=>{ TestBed.configureTestingModule({providers:[provideRouter([]),{provide:AuthStore,useValue:auth},{provide:ConfiguracionInicialStore,useValue:setup}]}); authenticated.set(true);mustChange.set(false);auth.hasPermission.mockReturnValue(true); });
    it('allows normal routes when setup is completed',async()=>{ setup.load.mockResolvedValue({configuracionInicialCompletada:true}); const result=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/ventas'} as RouterStateSnapshot)) as any; expect(result).toBe(true); });
    it('redirects operations to wizard while setup is pending',async()=>{ setup.load.mockResolvedValue({configuracionInicialCompletada:false}); const result=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/ventas'} as RouterStateSnapshot)) as any; expect((result as any).toString()).toContain('/configuracion/inicial'); });
    it('allows setup maintenance routes while pending',async()=>{ setup.load.mockResolvedValue({configuracionInicialCompletada:false}); const result=await TestBed.runInInjectionContext(()=>initialConfigurationGuard({} as ActivatedRouteSnapshot,{url:'/configuracion/mantenimientos'} as RouterStateSnapshot)) as any; expect(result).toBe(true); });
});
