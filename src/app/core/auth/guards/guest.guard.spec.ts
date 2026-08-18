import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { guestGuard } from './guest.guard';

describe('guestGuard', () => {
    const isAuthenticated = signal(false);
    const authStoreMock = { isAuthenticated: isAuthenticated.asReadonly() };
    const routerMock = { createUrlTree: vi.fn() };

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

    it('should allow access when the user is not authenticated', () => {
        const result = TestBed.runInInjectionContext(() =>
            guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
        );

        expect(result).toBe(true);
        expect(routerMock.createUrlTree).not.toHaveBeenCalled();
    });

    it('should redirect to dashboard when the user is authenticated', () => {
        const dashboardUrlTree = {} as UrlTree;
        isAuthenticated.set(true);
        routerMock.createUrlTree.mockReturnValue(dashboardUrlTree);

        const result = TestBed.runInInjectionContext(() =>
            guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
        );

        expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
        expect(result).toBe(dashboardUrlTree);
    });
});