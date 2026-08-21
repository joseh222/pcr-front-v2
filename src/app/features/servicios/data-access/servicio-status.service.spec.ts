import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { ServicioApiService } from './servicio-api.service';
import { ServicioStatusService } from './servicio-status.service';

describe('ServicioStatusService', () => {
    const apiMock = { changeStatus: vi.fn(() => of({ idServicio: 5, isActive: false, rowVersion: 'B', mensaje: 'Servicio desactivado correctamente.' })) };
    const dialogMock = { open: vi.fn(() => ({ afterClosed: () => of(true) })) };
    const feedbackMock = { success: vi.fn(), error: vi.fn() };

    beforeEach(() => {
        apiMock.changeStatus.mockClear(); dialogMock.open.mockClear(); feedbackMock.success.mockClear(); feedbackMock.error.mockClear();
        TestBed.configureTestingModule({ providers: [ServicioStatusService, { provide: ServicioApiService, useValue: apiMock }, { provide: MatDialog, useValue: dialogMock }, { provide: FeedbackService, useValue: feedbackMock }] });
    });

    it('should deactivate an active service after confirmation', () => {
        const service = TestBed.inject(ServicioStatusService);
        service.change({ idServicio: 5, codigo: 'CONSTANCIA', nombre: 'Constancia', isActive: true, rowVersion: 'A' }).subscribe();
        expect(apiMock.changeStatus).toHaveBeenCalledWith(5, { isActive: false, rowVersion: 'A' });
        expect(feedbackMock.success).toHaveBeenCalledWith('Servicio desactivado correctamente.');
    });
});
