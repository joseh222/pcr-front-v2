import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { CompraCancellationService } from '../compra-cancellation.service';
import { CompraApiService } from '../compra-api.service';

describe('CompraCancellationService', () => {
    const request = { motivoAnulacion: 'Compra registrada por error', rowVersion: 'AAAAAAAABQ=' };
    const response = { idCompra: 5, codCompra: 'CMP2026-000005', mensaje: 'Compra anulada correctamente.' } as any;
    const apiMock = { cancel: vi.fn(() => of(response)) };
    const dialogMock = { open: vi.fn(() => ({ afterClosed: () => of(request) })) };
    const feedbackMock = { success: vi.fn(), error: vi.fn() };

    beforeEach(() => {
        apiMock.cancel.mockClear(); dialogMock.open.mockClear(); feedbackMock.success.mockClear(); feedbackMock.error.mockClear();
        TestBed.configureTestingModule({ providers: [CompraCancellationService,
            { provide: CompraApiService, useValue: apiMock }, { provide: MatDialog, useValue: dialogMock }, { provide: FeedbackService, useValue: feedbackMock }
        ] });
    });

    it('should cancel purchase after confirmation', () => {
        const service = TestBed.inject(CompraCancellationService);
        service.cancel({ idCompra: 5, codCompra: 'CMP2026-000005', rowVersion: 'AAAAAAAABQ=' }).subscribe(result => expect(result?.idCompra).toBe(5));
        expect(apiMock.cancel).toHaveBeenCalledWith(5, request);
        expect(feedbackMock.success).toHaveBeenCalledWith('Compra anulada correctamente.');
    });
});
