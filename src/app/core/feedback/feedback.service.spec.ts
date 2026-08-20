import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
    const openMock = vi.fn();

    beforeEach(() => {
        openMock.mockReset();

        TestBed.configureTestingModule({
            providers: [
                FeedbackService,
                {
                    provide: MatSnackBar,
                    useValue: { open: openMock }
                }
            ]
        });
    });

    it('should show success feedback at the top right', () => {
        const service = TestBed.inject(FeedbackService);

        service.success('Misa registrada correctamente.');

        expect(openMock).toHaveBeenCalledWith(
            'Misa registrada correctamente.',
            '',
            expect.objectContaining({
                duration: 3500,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                politeness: 'polite'
            })
        );
    });

    it('should show persistent error feedback', () => {
        const service = TestBed.inject(FeedbackService);

        service.error('La misa no puede registrarse.');

        expect(openMock).toHaveBeenCalledWith(
            'La misa no puede registrarse.',
            'Cerrar',
            expect.objectContaining({
                horizontalPosition: 'end',
                verticalPosition: 'top',
                politeness: 'assertive'
            })
        );
    });

    it('should ignore empty messages', () => {
        const service = TestBed.inject(FeedbackService);

        service.success('   ');

        expect(openMock).not.toHaveBeenCalled();
    });
});