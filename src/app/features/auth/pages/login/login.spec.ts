import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { ThemePreference } from '../../../../core/theme/theme.model';
import { ThemeService } from '../../../../core/theme/theme.service';
import { AuthStore } from '../../data-access/auth.store';
import { LoginPage } from './login';

describe('LoginPage', () => {
    let fixture: ComponentFixture<LoginPage>;

    const isAuthenticating = signal(false);
    const mustChangePassword = signal(false);
    const themePreference = signal<ThemePreference>('system');
    const resolvedTheme = signal<'light' | 'dark'>('light');

    const authStoreMock = {
        isAuthenticating: isAuthenticating.asReadonly(),
        mustChangePassword: mustChangePassword.asReadonly(),
        login: vi.fn()
    };

    const themeServiceMock = {
        preference: themePreference.asReadonly(),
        resolvedTheme: resolvedTheme.asReadonly(),
        setPreference: vi.fn((preference: ThemePreference) => themePreference.set(preference))
    };

    const routerMock = {
        navigateByUrl: vi.fn()
    };

    const runtimeConfigMock = {
        config: {
            apiBaseUrl: 'https://localhost:9001/api',
            applicationName: 'PCR Front V2',
            environmentName: 'DEV',
            locale: 'es-PE',
            currency: 'PEN',
            defaultPageSize: 10,
            featureFlags: {}
        }
    };

    beforeEach(async () => {
        isAuthenticating.set(false);
        mustChangePassword.set(false);
        themePreference.set('system');

        authStoreMock.login.mockReset();
        themeServiceMock.setPreference.mockClear();
        routerMock.navigateByUrl.mockReset();
        routerMock.navigateByUrl.mockResolvedValue(true);

        await TestBed.configureTestingModule({
            imports: [LoginPage],
            providers: [
                {
                    provide: AuthStore,
                    useValue: authStoreMock
                },
                {
                    provide: ThemeService,
                    useValue: themeServiceMock
                },
                {
                    provide: RuntimeConfigService,
                    useValue: runtimeConfigMock
                },
                {
                    provide: Router,
                    useValue: routerMock
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginPage);
        fixture.detectChanges();
    });

    it('should not login when the form is invalid', async () => {
        submitForm();

        await fixture.whenStable();
        fixture.detectChanges();

        expect(authStoreMock.login).not.toHaveBeenCalled();
        expect(fixture.nativeElement.textContent).toContain('El usuario es obligatorio.');
        expect(fixture.nativeElement.textContent).toContain('La contraseña es obligatoria.');
    });

    it('should login and navigate to the application', async () => {
        authStoreMock.login.mockResolvedValue(undefined);

        setInput('login-username', 'ADMIN');
        setInput('login-password', 'Password123!');

        submitForm();

        await fixture.whenStable();

        expect(authStoreMock.login).toHaveBeenCalledWith({
            username: 'ADMIN',
            password: 'Password123!',
            deviceId: null,
            deviceLabel: 'PCR Front V2'
        });

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/', {
            replaceUrl: true
        });
    });

    it('should display the backend authentication error', async () => {
        authStoreMock.login.mockRejectedValue(new HttpErrorResponse({
            status: 401,
            error: {
                success: false,
                code: 401,
                messages: ['Credenciales inválidas.']
            }
        }));

        setInput('login-username', 'ADMIN');
        setInput('login-password', 'Incorrecta123!');

        submitForm();

        await fixture.whenStable();
        fixture.detectChanges();

        const error = fixture.nativeElement.querySelector('[data-testid="login-error"]');

        expect(error?.textContent).toContain('Credenciales inválidas.');
        expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should redirect to change-password when password change is required', async () => {
        mustChangePassword.set(true);
        authStoreMock.login.mockResolvedValue(undefined);

        setInput('login-username', 'USUARIO');
        setInput('login-password', 'Temporal123!');

        submitForm();

        await fixture.whenStable();

        expect(authStoreMock.login).toHaveBeenCalledWith({
            username: 'USUARIO',
            password: 'Temporal123!',
            deviceId: null,
            deviceLabel: 'PCR Front V2'
        });

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/change-password', {
            replaceUrl: true
        });
    });

    function setInput(testId: string, value: string): void {
        const input = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as HTMLInputElement;

        input.value = value;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
    }

    function submitForm(): void {
        const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

        form.dispatchEvent(new Event('submit', {
            bubbles: true,
            cancelable: true
        }));
    }
});