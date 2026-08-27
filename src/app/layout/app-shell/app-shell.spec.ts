import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { ThemePreference } from '../../core/theme/theme.model';
import { ThemeService } from '../../core/theme/theme.service';
import { AuthStore } from '../../features/auth/data-access/auth.store';
import { AppShell } from './app-shell';
import { By } from '@angular/platform-browser';
import { Sidebar } from '../sidebar/sidebar';

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
    const permissions = signal<readonly string[]>([]);
    const grantsAllPermissions = signal(true);
    const themePreference = signal<ThemePreference>('system');
    const resolvedTheme = signal<'light' | 'dark'>('light');

    const authStoreMock = {
        currentUser: currentUser.asReadonly(),
        roleCode: roleCode.asReadonly(),
        permissions: permissions.asReadonly(),
        grantsAllPermissions: grantsAllPermissions.asReadonly(),
        logout: vi.fn()
    };

    const themeServiceMock = {
        preference: themePreference.asReadonly(),
        resolvedTheme: resolvedTheme.asReadonly(),
        setPreference: vi.fn()
    };

    beforeEach(async () => {
        currentUser.set({
            idUser: 1,
            username: 'ADMIN',
            displayName: 'Administrador PCR',
            email: 'admin@pcr.pe',
            roleCode: 'ADMIN',
            sessionId: 'session-1',
            mustChangePassword: false,
            expiresAtUnix: 9999999999
        });

        roleCode.set('ADMIN');
        permissions.set([]);
        grantsAllPermissions.set(true);
        themePreference.set('system');
        resolvedTheme.set('light');

        authStoreMock.logout.mockReset();
        authStoreMock.logout.mockResolvedValue(undefined);
        themeServiceMock.setPreference.mockClear();

        await TestBed.configureTestingModule({
            imports: [AppShell],
            providers: [
                provideRouter([]),
                { provide: AuthStore, useValue: authStoreMock },
                { provide: ThemeService, useValue: themeServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppShell);
        fixture.detectChanges();
    });

    it('should render the componentized application layout', () => {
        expect(
            fixture.nativeElement.querySelector('pcr-sidebar')
        ).toBeTruthy();

        expect(
            fixture.nativeElement.querySelector('pcr-topbar')
        ).toBeTruthy();

        expect(
            fixture.nativeElement.querySelector('[data-testid="app-main"]')
        ).toBeTruthy();

        expect(
            fixture.nativeElement.querySelector('pcr-footer')
        ).toBeTruthy();
    });

    it('should open and close the mobile sidebar', () => {
        const sidebarDebug = fixture.debugElement.query(By.directive(Sidebar));
        const sidebar = sidebarDebug.componentInstance as Sidebar;

        expect(sidebar.open()).toBe(false);

        const toggle = fixture.nativeElement.querySelector(
            '[data-testid="mobile-sidebar-toggle"]'
        ) as HTMLButtonElement;

        expect(toggle).toBeTruthy();

        toggle.click();
        fixture.detectChanges();

        expect(sidebar.open()).toBe(true);

        const backdrop = fixture.nativeElement.querySelector(
            '[data-testid="sidebar-backdrop"]'
        ) as HTMLButtonElement;

        expect(backdrop).toBeTruthy();

        backdrop.click();
        fixture.detectChanges();

        expect(sidebar.open()).toBe(false);
    });

    it('should collapse and restore the desktop sidebar', () => {
        const sidebarDebug = fixture.debugElement.query(By.directive(Sidebar));
        const sidebar = sidebarDebug.componentInstance as Sidebar;

        expect(sidebar.collapsed()).toBe(false);

        const toggle = fixture.nativeElement.querySelector(
            '[data-testid="desktop-sidebar-toggle"]'
        ) as HTMLButtonElement;

        expect(toggle).toBeTruthy();

        toggle.click();
        fixture.detectChanges();

        expect(sidebar.collapsed()).toBe(true);

        const shell = fixture.nativeElement.querySelector(
            '[data-testid="app-shell"]'
        ) as HTMLElement;

        expect(
            shell.classList.contains('app-layout-sidebar-collapsed')
        ).toBe(true);

        toggle.click();
        fixture.detectChanges();

        expect(sidebar.collapsed()).toBe(false);
        expect(
            shell.classList.contains('app-layout-sidebar-collapsed')
        ).toBe(false);
    });
});