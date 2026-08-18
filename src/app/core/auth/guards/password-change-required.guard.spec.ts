import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { passwordChangeRequiredGuard } from './password-change-required.guard';

describe('passwordChangeRequiredGuard', () => {
    const isAuthenticated = signal(true);
    const mustChangePassword = signal(false);

    const authStoreMock = {
        isAuthenticated: isAuthenticated.asReadonly(),
        mustChangePassword: mustChangePassword.asReadonly()
    };

    const routerMock = {
        createUrlTree: vi.fn()
    };

    beforeEach(() => {
        isAuthenticated.set(true);
        mustChangePassword.set(false);
        routerMock.createUrlTree.mockReset();

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthStore, useValue: authStoreMock },
                { provide: Router, useValue: routerMock }
            ]
        });
    });

    const executeGuard = () =>
        TestBed.runInInjectionContext(() =>
            passwordChangeRequiredGuard(
                {} as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot
            )
        );

    it('should allow access when password change is not required', () => {
        const result = executeGuard();

        expect(result).toBe(true);
        expect(routerMock.createUrlTree).not.toHaveBeenCalled();
    });

    it('should redirect to change-password when password change is required', () => {
        mustChangePassword.set(true);

        const urlTree = {} as UrlTree;
        routerMock.createUrlTree.mockReturnValue(urlTree);

        const result = executeGuard();

        expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/change-password']);
        expect(result).toBe(urlTree);
    });

    it('should redirect to login when the user is not authenticated', () => {
        isAuthenticated.set(false);

        const urlTree = {} as UrlTree;
        routerMock.createUrlTree.mockReturnValue(urlTree);

        const result = executeGuard();

        expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
        expect(result).toBe(urlTree);
    });
});