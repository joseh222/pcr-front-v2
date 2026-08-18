import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AppShell } from './app-shell';
import { signal } from '@angular/core';
import { AuthStore } from '../../features/auth/data-access/auth.store';
import { ThemeService } from '../../core/theme/theme.service';
import { ThemePreference } from '../../core/theme/theme.model';

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
    const themePreference = signal<ThemePreference>('system');
    const resolvedTheme = signal<'light' | 'dark'>('light');

    const themeServiceMock = {
        preference: themePreference.asReadonly(),
        resolvedTheme: resolvedTheme.asReadonly(),
        setPreference: vi.fn()
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
                { provide: Router, useValue: routerMock },
                { provide: ThemeService, useValue: themeServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppShell);
        fixture.detectChanges();
    });

    it('should render the componentized application layout', () => {
        expect(fixture.nativeElement.querySelector('pcr-sidebar')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('pcr-topbar')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="app-main"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('pcr-footer')).toBeTruthy();
    });

    it('should open and close the mobile sidebar', () => {
        const toggle = fixture.nativeElement.querySelector('[data-testid="mobile-sidebar-toggle"]') as HTMLButtonElement;

        toggle.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="app-sidebar"]')
            .classList.contains('app-sidebar-open')).toBe(true);

        const backdrop = fixture.nativeElement.querySelector('[data-testid="sidebar-backdrop"]') as HTMLButtonElement;
        backdrop.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="app-sidebar"]')
            .classList.contains('app-sidebar-open')).toBe(false);
    });

    it('should collapse and restore the desktop sidebar', () => {
        const toggle = fixture.nativeElement.querySelector('[data-testid="desktop-sidebar-toggle"]') as HTMLButtonElement;

        toggle.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="app-shell"]')
            .classList.contains('app-layout-sidebar-collapsed')).toBe(true);

        toggle.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="app-shell"]')
            .classList.contains('app-layout-sidebar-collapsed')).toBe(false);
    });
});
