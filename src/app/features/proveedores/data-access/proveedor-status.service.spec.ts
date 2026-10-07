import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { ProveedorApiService } from './proveedor-api.service';
import { ProveedorStatusService } from './proveedor-status.service';

describe('ProveedorStatusService', () => {
    const apiMock = { changeStatus: vi.fn(() => of({ idProveedor: 5, isActive: false, rowVersion: 'B', mensaje: 'Proveedor desactivado correctamente.' })) };
    const dialogMock = { open: vi.fn(() => ({ afterClosed: () => of(true) })) };
    const feedbackMock = { success: vi.fn(), error: vi.fn() };

    beforeEach(() => {
        apiMock.changeStatus.mockClear(); dialogMock.open.mockClear(); feedbackMock.success.mockClear(); feedbackMock.error.mockClear();
        TestBed.configureTestingModule({ providers: [ProveedorStatusService, { provide: ProveedorApiService, useValue: apiMock }, { provide: MatDialog, useValue: dialogMock }, { provide: FeedbackService, useValue: feedbackMock }] });
    });

    it('should deactivate active supplier after confirmation', () => {
        const service = TestBed.inject(ProveedorStatusService);
        service.change({ idProveedor: 5, codProveedor: 'PRV2026-000005', razonSocial: 'Proveedor SAC', isActive: true, rowVersion: 'A' }).subscribe();
        expect(apiMock.changeStatus).toHaveBeenCalledWith(5, { isActive: false, rowVersion: 'A' });
        expect(feedbackMock.success).toHaveBeenCalled();
    });
});
