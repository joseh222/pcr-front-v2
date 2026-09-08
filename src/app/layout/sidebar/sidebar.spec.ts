import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { Sidebar } from './sidebar';
import { ConfiguracionParroquiaIdentidadStore } from '../../features/configuracion/data-access/configuracion-parroquia-identidad.store';
import { AUTH_ROLE, AuthRole } from '../../core/auth/auth-role.model';
import { AuthStore } from '../../features/auth/data-access/auth.store';
import { ConfiguracionInicialStore } from '../../features/configuracion/data-access/configuracion-inicial.store';
import { ConfiguracionInicialEstado } from '../../features/configuracion/data-access/models/configuracion-inicial.models';
import { ModuleStore } from '../../features/configuracion/data-access/module.store';
import { MODULE_CODE } from '../../core/licensing/module-code.model';
import { LicenciamientoEstado } from '../../features/configuracion/data-access/models/licenciamiento.models';

@Component({ standalone: true, template: '' })
class DashboardTestPage { }

describe('Sidebar', () => {
    let fixture: ComponentFixture<Sidebar>;
    let router: Router;
    const roleCode = signal<AuthRole>(AUTH_ROLE.ADMIN);
    const permissions = signal<readonly string[]>(['USUARIO_VER', 'ROL_VER']);
    const grantsAllPermissions = signal(true);
    const setupState = signal<ConfiguracionInicialEstado | null>({ configuracionInicialCompletada: true } as ConfiguracionInicialEstado);
    const enabledModules = signal<readonly string[]>([MODULE_CODE.SALES, MODULE_CODE.PURCHASES, MODULE_CODE.INVENTORY, MODULE_CODE.SERVICES, MODULE_CODE.MASSES, MODULE_CODE.SACRAMENTS, MODULE_CODE.REPORTS]);
    const licenseState = signal<LicenciamientoEstado | null>({ licenciaValida: true } as LicenciamientoEstado);

    const authStoreMock = { roleCode: roleCode.asReadonly(), permissions: permissions.asReadonly(), grantsAllPermissions: grantsAllPermissions.asReadonly() };
    const setupStoreMock = { state: setupState.asReadonly() };
    const moduleStoreMock = {
        state: licenseState.asReadonly(),
        hasAll: (codes: readonly string[]) => codes.every(code => enabledModules().includes(code))
    };

    beforeEach(async () => {
        roleCode.set(AUTH_ROLE.ADMIN);
        permissions.set(['USUARIO_VER', 'ROL_VER']);
        grantsAllPermissions.set(true);
        setupState.set({ configuracionInicialCompletada: true } as ConfiguracionInicialEstado);
        enabledModules.set([MODULE_CODE.SALES, MODULE_CODE.PURCHASES, MODULE_CODE.INVENTORY, MODULE_CODE.SERVICES, MODULE_CODE.MASSES, MODULE_CODE.SACRAMENTS, MODULE_CODE.REPORTS]);
        licenseState.set({ licenciaValida: true } as LicenciamientoEstado);

        await TestBed.configureTestingModule({
            imports: [Sidebar],
            providers: [
                provideRouter([
                    { path: 'dashboard', component: DashboardTestPage },
                    { path: 'configuracion/inicial', component: DashboardTestPage },
                    { path: 'configuracion/licencia', component: DashboardTestPage },
                    { path: 'configuracion/mantenimientos', component: DashboardTestPage },
                    { path: 'configuracion/impresion', component: DashboardTestPage },
                    { path: 'catalogos/servicios', component: DashboardTestPage },
                    { path: 'seguridad/usuarios', component: DashboardTestPage },
                    { path: 'seguridad/roles', component: DashboardTestPage },
                    { path: 'ventas', component: DashboardTestPage },
                    { path: 'personas', component: DashboardTestPage },
                    { path: 'inscripciones', component: DashboardTestPage }
                ]),
                { provide: AuthStore, useValue: authStoreMock },
                { provide: ConfiguracionInicialStore, useValue: setupStoreMock },
                { provide: ModuleStore, useValue: moduleStoreMock },
                { provide: ConfiguracionParroquiaIdentidadStore, useValue: { nombreParroquia: () => 'Parroquia Demo' } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Sidebar);
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should render the configured navigation items after initial setup', () => {
        const dashboard = fixture.nativeElement.querySelector('[data-testid="nav-dashboard"]') as HTMLAnchorElement;
        expect(dashboard).toBeTruthy();
        expect(dashboard.textContent).toContain('Dashboard');
        expect(dashboard.getAttribute('href')).toBe('/dashboard');
    });

    it('should show only License inside Configuracion before activation', () => {
        setupState.set({ configuracionInicialCompletada: false } as ConfiguracionInicialEstado);
        licenseState.set({ licenciaValida: false } as LicenciamientoEstado);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="nav-licencia-sistema"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-configuracion-inicial"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-configuracion-mantenimientos"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-dashboard"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-usuarios"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-ventas"]')).toBeFalsy();
    });

    it('should show configuration, security and dashboard after activation but hide operations until setup finishes', () => {
        setupState.set({ configuracionInicialCompletada: false } as ConfiguracionInicialEstado);
        licenseState.set({ licenciaValida: true } as LicenciamientoEstado);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="nav-dashboard"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-configuracion-inicial"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-licencia-sistema"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-configuracion-mantenimientos"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-configuracion-general"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-usuarios"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-roles"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-ventas"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-personas"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-catalogo-servicios"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-inscripciones"]')).toBeFalsy();
    });

    it('should hide modules that are not enabled by the installation license after setup', () => {
        enabledModules.set([MODULE_CODE.SALES, MODULE_CODE.SERVICES, MODULE_CODE.SACRAMENTS]);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="nav-ventas"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-servicios"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-bautismos"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-compras"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-productos"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-misas"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-reporte-ventas"]')).toBeFalsy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-personas"]')).toBeTruthy();
    });

    it('should expose Inscripciones as a coming-soon permission based entry after setup', () => {
        const inscriptions = fixture.nativeElement.querySelector('[data-testid="nav-inscripciones"]') as HTMLAnchorElement;
        expect(inscriptions).toBeTruthy();
        expect(inscriptions.textContent).toContain('Inscripciones');
        expect(inscriptions.textContent).toContain('Próximamente');
        expect(inscriptions.getAttribute('href')).toBe('/inscripciones');
    });

    it('should mark the current route as active', async () => {
        await router.navigateByUrl('/dashboard');
        await fixture.whenStable();
        fixture.detectChanges();
        const dashboard = fixture.nativeElement.querySelector('[data-testid="nav-dashboard"]') as HTMLAnchorElement;
        expect(dashboard.classList.contains('sidebar-item-active')).toBe(true);
    });

    it('should request sidebar close after navigation', () => {
        const closeSpy = vi.fn();
        fixture.componentInstance.closeRequested.subscribe(closeSpy);
        const dashboard = fixture.nativeElement.querySelector('[data-testid="nav-dashboard"]') as HTMLAnchorElement;
        dashboard.click();
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should render the sidebar container', () => {
        expect(fixture.nativeElement.querySelector('[data-testid="app-sidebar"]')).toBeTruthy();
    });

    it('should apply the open state', () => {
        fixture.componentRef.setInput('open', true);
        fixture.detectChanges();
        const sidebar = fixture.nativeElement.querySelector('[data-testid="app-sidebar"]') as HTMLElement;
        expect(sidebar.classList.contains('app-sidebar-open')).toBe(true);
    });

    it('should apply the collapsed state', () => {
        fixture.componentRef.setInput('collapsed', true);
        fixture.detectChanges();
        const sidebar = fixture.nativeElement.querySelector('[data-testid="app-sidebar"]') as HTMLElement;
        expect(sidebar.classList.contains('app-sidebar-collapsed')).toBe(true);
    });

    it('should render the navigation sections', () => {
        const principal = fixture.nativeElement.querySelector('[data-testid="nav-section-principal"]') as HTMLElement;
        expect(principal).toBeTruthy();
        expect(principal.textContent).toContain('Principal');
        expect(principal.textContent).toContain('Dashboard');
    });

    it('should render purchases as enabled navigation item after initial setup', () => {
        const compras = fixture.nativeElement.querySelector('[data-testid="nav-compras"]') as HTMLAnchorElement;
        expect(compras).toBeTruthy();
        expect(compras.getAttribute('aria-disabled')).toBeNull();
        expect(compras.getAttribute('href')).toBe('/compras');
    });

    it('should expose security navigation by permission and not by legacy role', () => {
        roleCode.set(AUTH_ROLE.USER);
        permissions.set(['USUARIO_VER']);
        grantsAllPermissions.set(false);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-usuarios"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="nav-roles"]')).toBeFalsy();
    });
});
