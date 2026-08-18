import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Topbar } from './topbar';
import { AuthStore } from '../../features/auth/data-access/auth.store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { ThemePreference } from '../../core/theme/theme.model';
import { ThemeService } from '../../core/theme/theme.service';

describe('Topbar', () => {
    let fixture: ComponentFixture<Topbar>;
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
        await TestBed.configureTestingModule({
            imports: [Topbar],
            providers: [
                { provide: AuthStore, useValue: authStoreMock },
                { provide: Router, useValue: routerMock },
                { provide: ThemeService, useValue: themeServiceMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(Topbar);
        fixture.detectChanges();
    });

    it('should render the application title', () => {
        expect(fixture.nativeElement.textContent).toContain('Sistema de Gestión Parroquial');
        expect(fixture.nativeElement.textContent).toContain('Parroquia Cristo Rey');
    });

    it('should emit mobile menu requests', () => {
        const emitted = vi.fn();
        fixture.componentInstance.mobileMenuRequested.subscribe(emitted);

        (fixture.nativeElement.querySelector('[data-testid="mobile-sidebar-toggle"]') as HTMLButtonElement).click();

        expect(emitted).toHaveBeenCalledTimes(1);
    });

    it('should emit desktop menu requests', () => {
        const emitted = vi.fn();
        fixture.componentInstance.desktopMenuRequested.subscribe(emitted);

        (fixture.nativeElement.querySelector('[data-testid="desktop-sidebar-toggle"]') as HTMLButtonElement).click();

        expect(emitted).toHaveBeenCalledTimes(1);
    });
});
