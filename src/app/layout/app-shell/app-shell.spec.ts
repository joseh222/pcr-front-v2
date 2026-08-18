import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AppShell } from './app-shell';
import { signal } from '@angular/core';
import { AuthStore } from '../../features/auth/data-access/auth.store';

describe('AppShell', () => {
    let fixture: ComponentFixture<AppShell>;
    const currentUser = signal({
        idUser: 1,
        username: 'ADMIN',
        displayName: 'Administrador PCR',
        email: 'admin@pcr.pe',
        roleCode: 'ADMIN',
        sessionId: 'session-1',
        mustChangePassword: false,
        expiresAtUnix: 9999999999
    });

    const roleCode = signal('ADMIN');

    const authStoreMock = {
        currentUser: currentUser.asReadonly(),
        roleCode: roleCode.asReadonly(),
        logout: vi.fn()
    };

    const routerMock = {
        navigateByUrl: vi.fn()
    };

    beforeEach(async () => {
        authStoreMock.logout.mockReset();
        authStoreMock.logout.mockResolvedValue(undefined);

        routerMock.navigateByUrl.mockReset();
        routerMock.navigateByUrl.mockResolvedValue(true);

        await TestBed.configureTestingModule({
            imports: [AppShell],
            providers: [
                { provide: AuthStore, useValue: authStoreMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppShell);
        fixture.detectChanges();
    });

    it('should render the main application layout', () => {
        expect(fixture.nativeElement.querySelector('[data-testid="app-sidebar"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="app-topbar"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="app-main"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="app-footer"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="user-area"]')).toBeTruthy();
    });

    it('should open and close the mobile sidebar', () => {
        const toggle = fixture.nativeElement.querySelector(
            '[data-testid="mobile-sidebar-toggle"]'
        ) as HTMLButtonElement;

        toggle.click();
        fixture.detectChanges();

        expect(
            fixture.nativeElement
                .querySelector('[data-testid="app-sidebar"]')
                .classList.contains('app-sidebar-open')
        ).toBe(true);

        const backdrop = fixture.nativeElement.querySelector(
            '[data-testid="sidebar-backdrop"]'
        ) as HTMLButtonElement;

        backdrop.click();
        fixture.detectChanges();

        expect(
            fixture.nativeElement
                .querySelector('[data-testid="app-sidebar"]')
                .classList.contains('app-sidebar-open')
        ).toBe(false);
    });

    it('should display the parish footer', () => {
        const footer = fixture.nativeElement.querySelector('[data-testid="app-footer"]');

        expect(footer.textContent).toContain('Parroquia Cristo Rey');
    });

    it('should collapse and restore the desktop sidebar', () => {
        const toggle = fixture.nativeElement.querySelector(
            '[data-testid="desktop-sidebar-toggle"]'
        ) as HTMLButtonElement;

        toggle.click();
        fixture.detectChanges();

        expect(
            fixture.nativeElement
                .querySelector('[data-testid="app-shell"]')
                .classList.contains('app-layout-sidebar-collapsed')
        ).toBe(true);

        toggle.click();
        fixture.detectChanges();

        expect(
            fixture.nativeElement
                .querySelector('[data-testid="app-shell"]')
                .classList.contains('app-layout-sidebar-collapsed')
        ).toBe(false);
    });

    it('should display the authenticated user', () => {
        const displayName = fixture.nativeElement.querySelector(
            '[data-testid="user-display-name"]'
        );

        const role = fixture.nativeElement.querySelector(
            '[data-testid="user-role"]'
        );

        expect(displayName?.textContent).toContain('Administrador PCR');
        expect(role?.textContent).toContain('ADMIN');
    });

    it('should logout and navigate to login', async () => {
        await (fixture.componentInstance as any).logout();

        expect(authStoreMock.logout).toHaveBeenCalledTimes(1);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login', {
            replaceUrl: true
        });
    });
});