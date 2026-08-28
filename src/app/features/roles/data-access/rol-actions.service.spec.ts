import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { RolApiService } from './rol-api.service';
import { RolActionsService } from './rol-actions.service';

describe('RolActionsService', () => {
    const dialogMock = { open: vi.fn(() => ({ afterClosed: () => of(true) })) }; const feedbackMock = { success: vi.fn(), error: vi.fn() }; const apiMock = { getById: vi.fn(() => of({ rowVersion: 'A' })), changeStatus: vi.fn(() => of({ idRole: 4, isActive: false, affectedUsers: 0, rowVersion: 'B', mensaje: 'OK' })) };
    beforeEach(() => { Object.values(apiMock).forEach(mock => mock.mockClear()); dialogMock.open.mockClear(); feedbackMock.success.mockClear(); TestBed.configureTestingModule({ providers: [RolActionsService, { provide: MatDialog, useValue: dialogMock }, { provide: FeedbackService, useValue: feedbackMock }, { provide: RolApiService, useValue: apiMock }] }); });
    it('should not change status of a system role', () => { const service = TestBed.inject(RolActionsService); service.changeStatus({ idRole: 1, code: 'ADMIN', name: 'Administrador', description: null, isActive: true, isSystem: true, grantsAllPermissions: true }).subscribe(result => expect(result).toBe(false)); expect(dialogMock.open).not.toHaveBeenCalled(); });
    it('should confirm and use fresh rowVersion for custom role', () => { const service = TestBed.inject(RolActionsService); service.changeStatus({ idRole: 4, code: 'SECRETARIA', name: 'Secretaría', description: null, isActive: true, isSystem: false, grantsAllPermissions: false }).subscribe(result => expect(result).toBe(true)); expect(apiMock.getById).toHaveBeenCalledWith(4); expect(apiMock.changeStatus).toHaveBeenCalledWith(4, false, 'A'); });
});
