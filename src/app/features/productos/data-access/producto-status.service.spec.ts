import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { ProductoApiService } from './producto-api.service';
import { ProductoStatusService } from './producto-status.service';

describe('ProductoStatusService', () => {
    const apiMock = { changeStatus: vi.fn(() => of({ idProducto: 5, isActive: false, rowVersion: 'B', mensaje: 'Producto desactivado correctamente.' })) };
    const dialogMock = { open: vi.fn(() => ({ afterClosed: () => of(true) })) };
    const feedbackMock = { success: vi.fn(), error: vi.fn() };

    beforeEach(() => {
        apiMock.changeStatus.mockClear(); dialogMock.open.mockClear(); feedbackMock.success.mockClear(); feedbackMock.error.mockClear();
        TestBed.configureTestingModule({ providers: [ProductoStatusService, { provide: ProductoApiService, useValue: apiMock }, { provide: MatDialog, useValue: dialogMock }, { provide: FeedbackService, useValue: feedbackMock }] });
    });

    it('should deactivate an active product after confirmation', () => {
        const service = TestBed.inject(ProductoStatusService);
        service.change({ idProducto: 5, codProducto: 'P2026-00000005', nombre: 'Vela', isActive: true, rowVersion: 'A' }).subscribe();
        expect(apiMock.changeStatus).toHaveBeenCalledWith(5, { isActive: false, rowVersion: 'A' });
        expect(feedbackMock.success).toHaveBeenCalledWith('Producto desactivado correctamente.');
    });
});
