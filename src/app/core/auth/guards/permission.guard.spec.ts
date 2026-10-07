import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { vi } from 'vitest';
import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { PERMISSION_CODE, PermissionCode } from '../permission-code.model';
import { permissionGuard } from './permission.guard';

describe('permissionGuard', () => {
    const isAuthenticated = signal(true); const granted = new Set<string>();
    const authStoreMock = { isAuthenticated: isAuthenticated.asReadonly(), hasAllPermissions: vi.fn((permissions: readonly PermissionCode[]) => permissions.every(value => granted.has(value))), hasAnyPermission: vi.fn((permissions: readonly PermissionCode[]) => permissions.some(value => granted.has(value))) };
    const routerMock = { createUrlTree: vi.fn() };
    beforeEach(() => { isAuthenticated.set(true); granted.clear(); authStoreMock.hasAllPermissions.mockClear(); authStoreMock.hasAnyPermission.mockClear(); routerMock.createUrlTree.mockReset(); TestBed.configureTestingModule({ providers: [{ provide: AuthStore, useValue: authStoreMock }, { provide: Router, useValue: routerMock }] }); });
    const execute = (permissions?: readonly PermissionCode[], permissionMode?: 'all' | 'any') => TestBed.runInInjectionContext(() => permissionGuard({ data: permissions ? { permissions, permissionMode } : {} } as unknown as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
    it('should allow when all required permissions are granted', () => { granted.add(PERMISSION_CODE.USER_VIEW); granted.add(PERMISSION_CODE.USER_EDIT); expect(execute([PERMISSION_CODE.USER_VIEW, PERMISSION_CODE.USER_EDIT])).toBe(true); });
    it('should allow any mode when one permission is granted', () => { granted.add(PERMISSION_CODE.USER_VIEW); expect(execute([PERMISSION_CODE.USER_VIEW, PERMISSION_CODE.ROLE_VIEW], 'any')).toBe(true); });
    it('should redirect to forbidden when permission is missing', () => { const tree = {} as UrlTree; routerMock.createUrlTree.mockReturnValue(tree); expect(execute([PERMISSION_CODE.ROLE_VIEW])).toBe(tree); expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/forbidden']); });
    it('should redirect to login when unauthenticated', () => { isAuthenticated.set(false); const tree = {} as UrlTree; routerMock.createUrlTree.mockReturnValue(tree); expect(execute([PERMISSION_CODE.USER_VIEW])).toBe(tree); expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']); });
});
