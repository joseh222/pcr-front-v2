import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { UserMenu } from './user-menu';

describe('UserMenu', () => {
    let fixture: ComponentFixture<UserMenu>;

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
    const roleCodes = signal<readonly string[]>(['ADMIN']);

    const authStoreMock = {
        currentUser: currentUser.asReadonly(),
        roleCode: roleCode.asReadonly(),
        roleCodes: roleCodes.asReadonly(),
        logout: vi.fn()
    };

    const routerMock = {
        navigateByUrl: vi.fn()
    };

    beforeEach(async () => {
        roleCodes.set(['ADMIN']);
        authStoreMock.logout.mockReset();
        authStoreMock.logout.mockResolvedValue(undefined);

        routerMock.navigateByUrl.mockReset();
        routerMock.navigateByUrl.mockResolvedValue(true);

        await TestBed.configureTestingModule({
            imports: [UserMenu],
            providers: [
                { provide: AuthStore, useValue: authStoreMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserMenu);
        fixture.detectChanges();
    });

    it('should display the authenticated user and role', () => {
        const name = fixture.nativeElement.querySelector(
            '[data-testid="user-display-name"]'
        );

        const role = fixture.nativeElement.querySelector(
            '[data-testid="user-role"]'
        );

        expect(name?.textContent).toContain('Administrador PCR');
        expect(role?.textContent).toContain('ADMIN');
    });

    it('should display current RBAC roles instead of the legacy USER role', () => {
        roleCodes.set(['SECRETARIA', 'TESORERIA']); fixture.detectChanges();
        const role = fixture.nativeElement.querySelector('[data-testid="user-role"]');
        expect(role?.textContent).toContain('SECRETARIA'); expect(role?.textContent).toContain('TESORERIA');
    });

    it('should logout and navigate to login', async () => {
        await (fixture.componentInstance as any).logout();

        expect(authStoreMock.logout).toHaveBeenCalledTimes(1);

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login', {
            replaceUrl: true
        });
    });

    it('should navigate to login even when logout request fails', async () => {
        authStoreMock.logout.mockRejectedValue(new Error('Logout failed'));

        await (fixture.componentInstance as any).logout();

        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login', {
            replaceUrl: true
        });
    });
});