import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { SolicitudServicioApiService } from './solicitud-servicio-api.service';
import { SolicitudServicioCancellationService } from './solicitud-servicio-cancellation.service';

describe('SolicitudServicioCancellationService', () => {
    const request = { motivo: 'Cancelado', rowVersion: 'A' };
    const apiMock = { cancel: vi.fn(() => of({ idSolicitudServicio: 10, mensaje: 'Solicitud anulada correctamente.' } as any)) };
    const dialogMock = { open: vi.fn(() => ({ afterClosed: () => of(request) })) };
    const feedbackMock = { success: vi.fn(), error: vi.fn() };
    beforeEach(() => {
        apiMock.cancel.mockClear(); dialogMock.open.mockClear(); feedbackMock.success.mockClear(); feedbackMock.error.mockClear();
        TestBed.configureTestingModule({ providers: [SolicitudServicioCancellationService, { provide: SolicitudServicioApiService, useValue: apiMock }, { provide: MatDialog, useValue: dialogMock }, { provide: FeedbackService, useValue: feedbackMock }] });
    });

    it('should cancel after confirmation', () => {
        const service = TestBed.inject(SolicitudServicioCancellationService);
        service.cancel({ idSolicitudServicio: 10, codSolicitudServicio: 'SS2026-00010', rowVersion: 'A' }).subscribe();
        expect(apiMock.cancel).toHaveBeenCalledWith(10, request); expect(feedbackMock.success).toHaveBeenCalled();
    });
});
