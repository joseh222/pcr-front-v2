import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { vi } from 'vitest';

import { routes } from './app.routes';
import { ThemePreference } from './core/theme/theme.model';
import { ThemeService } from './core/theme/theme.service';
import { AppShell } from './layout/app-shell/app-shell';
import { NotFound } from './shared/pages/not-found/not-found';

describe('Application routes', () => {
    const preference = signal<ThemePreference>('system');
    const resolvedTheme = signal<'light' | 'dark'>('light');

    const themeServiceMock = {
        preference: preference.asReadonly(),
        resolvedTheme: resolvedTheme.asReadonly(),
        setPreference: vi.fn()
    };

    beforeEach(() => {
        preference.set('system');
        resolvedTheme.set('light');
        themeServiceMock.setPreference.mockClear();

        TestBed.configureTestingModule({
            providers: [
                provideRouter(routes),
                {
                    provide: ThemeService,
                    useValue: themeServiceMock
                }
            ]
        });
    });

    it('should load the application shell for the root route', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/', AppShell);

        expect(harness.routeNativeElement?.textContent).toContain('PCR Front V2');
        expect(harness.routeNativeElement?.textContent).toContain('Claro');
        expect(harness.routeNativeElement?.textContent).toContain('Oscuro');
        expect(harness.routeNativeElement?.textContent).toContain('Sistema');
    });

    it('should load the not found page for an unknown route', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/ruta-que-no-existe', NotFound);

        expect(harness.routeNativeElement?.textContent).toContain('Página no encontrada');
        expect(harness.routeNativeElement?.textContent).toContain('ERROR 404');
    });
});