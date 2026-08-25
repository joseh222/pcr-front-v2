import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { Sidebar } from './sidebar';
import { AUTH_ROLE } from '../../core/auth/auth-role.model';
import { AuthStore } from '../../features/auth/data-access/auth.store';

@Component({
    standalone: true,
    template: ''
})
class DashboardTestPage { }

describe('Sidebar', () => {
    let fixture: ComponentFixture<Sidebar>;
    let router: Router;
    const roleCode = signal(AUTH_ROLE.ADMIN);

    const authStoreMock = {
        roleCode: roleCode.asReadonly()
    };
    beforeEach(async () => {
        roleCode.set(AUTH_ROLE.ADMIN);
        await TestBed.configureTestingModule({
            imports: [Sidebar],
            providers: [
                provideRouter([
                    {
                        path: 'dashboard',
                        component: DashboardTestPage
                    },
                ]),
                { provide: AuthStore, useValue: authStoreMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Sidebar);
        router = TestBed.inject(Router);

        fixture.detectChanges();
    });

    it('should render the configured navigation items', () => {
        const dashboard = fixture.nativeElement.querySelector(
            '[data-testid="nav-dashboard"]'
        ) as HTMLAnchorElement;

        expect(dashboard).toBeTruthy();
        expect(dashboard.textContent).toContain('Dashboard');
        expect(dashboard.getAttribute('href')).toBe('/dashboard');
    });

    it('should mark the current route as active', async () => {
        await router.navigateByUrl('/dashboard');
        await fixture.whenStable();
        fixture.detectChanges();

        const dashboard = fixture.nativeElement.querySelector(
            '[data-testid="nav-dashboard"]'
        ) as HTMLAnchorElement;

        expect(
            dashboard.classList.contains('sidebar-item-active')
        ).toBe(true);
    });

    it('should request sidebar close after navigation', () => {
        const closeSpy = vi.fn();
        fixture.componentInstance.closeRequested.subscribe(closeSpy);

        const dashboard = fixture.nativeElement.querySelector(
            '[data-testid="nav-dashboard"]'
        ) as HTMLAnchorElement;

        dashboard.click();

        expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should render the sidebar container', () => {
        const sidebar = fixture.nativeElement.querySelector(
            '[data-testid="app-sidebar"]'
        ) as HTMLElement;

        expect(sidebar).toBeTruthy();
    });

    it('should apply the open state', () => {
        fixture.componentRef.setInput('open', true);
        fixture.detectChanges();

        const sidebar = fixture.nativeElement.querySelector(
            '[data-testid="app-sidebar"]'
        ) as HTMLElement;

        expect(
            sidebar.classList.contains('app-sidebar-open')
        ).toBe(true);
    });

    it('should apply the collapsed state', () => {
        fixture.componentRef.setInput('collapsed', true);
        fixture.detectChanges();

        const sidebar = fixture.nativeElement.querySelector(
            '[data-testid="app-sidebar"]'
        ) as HTMLElement;

        expect(
            sidebar.classList.contains('app-sidebar-collapsed')
        ).toBe(true);
    });

    it('should render the navigation sections', () => {
        const principal = fixture.nativeElement.querySelector(
            '[data-testid="nav-section-principal"]'
        ) as HTMLElement;

        expect(principal).toBeTruthy();
        expect(principal.textContent).toContain('Principal');
        expect(principal.textContent).toContain('Dashboard');
    });
    it('should render purchases as enabled navigation item', () => {
        const compras = fixture.nativeElement.querySelector('[data-testid="nav-compras"]') as HTMLAnchorElement;
        expect(compras).toBeTruthy();
        expect(compras.getAttribute('aria-disabled')).toBeNull();
        expect(compras.getAttribute('href')).toBe('/compras/nueva');
    });

});