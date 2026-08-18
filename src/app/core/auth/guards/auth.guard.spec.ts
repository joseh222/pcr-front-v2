import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { signal } from '@angular/core';

import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
    const isAuthenticated = signal(false);

    const authStoreMock = {
        isAuthenticated: isAuthenticated.asReadonly()
    };

    const routerMock = {
        createUrlTree: vi.fn()
    };

    beforeEach(() => {
        isAuthenticated.set(false);
        routerMock.createUrlTree.mockReset();

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthStore, useValue: authStoreMock },
                { provide: Router, useValue: routerMock }
            ]
        });
    });

    it('should allow access when the user is authenticated', () => {
        isAuthenticated.set(true);

        const result = TestBed.runInInjectionContext(() =>
            authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
        );

        expect(result).toBe(true);
        expect(routerMock.createUrlTree).not.toHaveBeenCalled();
    });

    it('should redirect to login when the user is not authenticated', () => {
        const loginUrlTree = {} as UrlTree;
        routerMock.createUrlTree.mockReturnValue(loginUrlTree);

        const result = TestBed.runInInjectionContext(() =>
            authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
        );

        expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
        expect(result).toBe(loginUrlTree);
    });
});