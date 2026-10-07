import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { VentaCancellationService } from '../venta-cancellation.service';
import { VentaApiService } from '../venta-api.service';
import { FeedbackService } from '../../../../core/feedback/feedback.service';

describe('VentaCancellationService', () => {
    const request = {
        idRazonAnulacion: 1,
        motivoAnulacion: 'Error',
        rowVersion: 'AAAAAAAABQ='
    };

    const response = {
        idVenta: 15,
        codVenta: 'V2026-00015',
        mensaje: 'Venta anulada correctamente.'
    } as any;

    const apiMock = {
        getRazonesAnulacion: vi.fn(() => of([{
            idRazonAnulacion: 1,
            codigo: 'ERROR',
            nombre: 'Error',
            requiereDetalle: true,
            isActive: true
        }])),
        cancel: vi.fn(() => of(response))
    };

    const dialogMock = {
        open: vi.fn(() => ({
            afterClosed: () => of(request)
        }))
    };

    const feedbackMock = {
        success: vi.fn(),
        error: vi.fn()
    };

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        dialogMock.open.mockClear();
        feedbackMock.success.mockClear();
        feedbackMock.error.mockClear();

        TestBed.configureTestingModule({
            providers: [
                VentaCancellationService,
                { provide: VentaApiService, useValue: apiMock },
                { provide: MatDialog, useValue: dialogMock },
                { provide: FeedbackService, useValue: feedbackMock }
            ]
        });
    });

    it('should cancel a sale after confirmation', () => {
        const service = TestBed.inject(VentaCancellationService);

        service.cancel({
            idVenta: 15,
            codVenta: 'V2026-00015',
            rowVersion: 'AAAAAAAABQ='
        }).subscribe(result => {
            expect(result?.idVenta).toBe(15);
        });

        expect(apiMock.getRazonesAnulacion).toHaveBeenCalledOnce();
        expect(apiMock.cancel).toHaveBeenCalledWith(15, request);
        expect(feedbackMock.success).toHaveBeenCalledWith(
            'Venta anulada correctamente.'
        );
    });
});