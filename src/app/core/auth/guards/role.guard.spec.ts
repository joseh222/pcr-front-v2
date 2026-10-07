import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AUTH_ROLE, AuthRole } from '../auth-role.model';
import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
    const isAuthenticated = signal(true);
    const role = signal<AuthRole>(AUTH_ROLE.ADMIN);

    const authStoreMock = {
        isAuthenticated: isAuthenticated.asReadonly(),
        hasRole: vi.fn((requiredRole: AuthRole) => role() === requiredRole)
    };

    const routerMock = {
        createUrlTree: vi.fn()
    };

    beforeEach(() => {
        isAuthenticated.set(true);
        role.set(AUTH_ROLE.ADMIN);
        authStoreMock.hasRole.mockClear();
        routerMock.createUrlTree.mockReset();

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthStore, useValue: authStoreMock },
                { provide: Router, useValue: routerMock }
            ]
        });
    });

    const executeGuard = (roles?: AuthRole[]) =>
        TestBed.runInInjectionContext(() =>
            roleGuard(
                { data: roles ? { roles } : {} } as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot
            )
        );

    it('should allow access when the user has an allowed role', () => {
        const result = executeGuard([AUTH_ROLE.ADMIN]);

        expect(result).toBe(true);
        expect(authStoreMock.hasRole).toHaveBeenCalledWith(AUTH_ROLE.ADMIN);
    });

    it('should redirect to dashboard when the user does not have an allowed role', () => {
        role.set(AUTH_ROLE.USER);

        const dashboardUrlTree = {} as UrlTree;
        routerMock.createUrlTree.mockReturnValue(dashboardUrlTree);

        const result = executeGuard([AUTH_ROLE.ADMIN]);

        expect(result).toBe(dashboardUrlTree);
        expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should allow access when no roles are configured', () => {
        const result = executeGuard();

        expect(result).toBe(true);
        expect(authStoreMock.hasRole).not.toHaveBeenCalled();
    });

    it('should redirect to login when the user is not authenticated', () => {
        isAuthenticated.set(false);

        const loginUrlTree = {} as UrlTree;
        routerMock.createUrlTree.mockReturnValue(loginUrlTree);

        const result = executeGuard([AUTH_ROLE.ADMIN]);

        expect(result).toBe(loginUrlTree);
        expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
        expect(authStoreMock.hasRole).not.toHaveBeenCalled();
    });
});