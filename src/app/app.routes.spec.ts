import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { vi } from 'vitest';

import { routes } from './app.routes';
import { ThemePreference } from './core/theme/theme.model';
import { ThemeService } from './core/theme/theme.service';
import { AppShell } from './layout/app-shell/app-shell';
import { NotFound } from './shared/pages/not-found/not-found';
import { AuthStore } from './features/auth/data-access/auth.store';
import { ChangePasswordPage } from './features/auth/pages/change-password/change-password';
import { DashboardPage } from './features/dashboard/pages/dashboard';

describe('Application routes', () => {
    const preference = signal<ThemePreference>('system');
    const resolvedTheme = signal<'light' | 'dark'>('light');
    const isAuthenticated = signal(true);
    const mustChangePassword = signal(false);

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
        isAuthenticated: isAuthenticated.asReadonly(),
        mustChangePassword: mustChangePassword.asReadonly(),
        currentUser: currentUser.asReadonly(),
        roleCode: roleCode.asReadonly(),
        logout: vi.fn()
    };
    const themeServiceMock = {
        preference: preference.asReadonly(),
        resolvedTheme: resolvedTheme.asReadonly(),
        setPreference: vi.fn()
    };

    beforeEach(() => {
        isAuthenticated.set(true);
        preference.set('system');
        resolvedTheme.set('light');
        mustChangePassword.set(false);
        themeServiceMock.setPreference.mockClear();
        TestBed.configureTestingModule({
            providers: [
                provideRouter(routes),
                {
                    provide: ThemeService,
                    useValue: themeServiceMock
                },
                { provide: AuthStore, useValue: authStoreMock }
            ]
        });
    });

    it('should redirect the root route to dashboard', async () => {
        const harness = await RouterTestingHarness.create();
        const router = TestBed.inject(Router);

        await harness.navigateByUrl('/', AppShell);

        expect(router.url).toBe('/dashboard');
        expect(harness.routeNativeElement?.textContent).toContain('Dashboard');
        expect(harness.routeNativeElement?.textContent).toContain(
            'Bienvenido al Sistema de Gestión Parroquial.'
        );
    });
    it('should load the not found page for an unknown route', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/ruta-que-no-existe', NotFound);

        expect(harness.routeNativeElement?.textContent).toContain('Página no encontrada');
        expect(harness.routeNativeElement?.textContent).toContain('ERROR 404');
    });

    it('should redirect to password change when it is required', async () => {
        mustChangePassword.set(true);

        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/', ChangePasswordPage);

        expect(harness.routeNativeElement?.textContent).toContain('Cambiar contraseña');
    });

    it('should load misas inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();

        await harness.navigateByUrl('/misas', AppShell);

        expect(harness.routeNativeElement?.textContent).toContain('Misas');
        expect(harness.routeNativeElement?.textContent).toContain(
            'Gestión de misas e intenciones parroquiales.'
        );
    });
});