import { HttpErrorResponse } from '@angular/common/http';

import { getApiErrorMessage } from './api-error-message';

describe('getApiErrorMessage', () => {
    it('should return backend messages', () => {
        const error = new HttpErrorResponse({
            status: 400,
            error: {
                messages: [
                    'La misa de matrimonio debe contener exactamente dos personas.'
                ]
            }
        });

        expect(getApiErrorMessage(error)).toBe(
            'La misa de matrimonio debe contener exactamente dos personas.'
        );
    });

    it('should return backend detail', () => {
        const error = new HttpErrorResponse({
            status: 400,
            error: {
                detail: 'La misa no puede modificarse.'
            }
        });

        expect(getApiErrorMessage(error)).toBe('La misa no puede modificarse.');
    });

    it('should return backend message', () => {
        const error = new HttpErrorResponse({
            status: 400,
            error: {
                message: 'Los datos enviados no son válidos.'
            }
        });

        expect(getApiErrorMessage(error)).toBe('Los datos enviados no son válidos.');
    });

    it('should return connection error', () => {
        const error = new HttpErrorResponse({ status: 0 });

        expect(getApiErrorMessage(error)).toBe(
            'No se pudo conectar con el servidor.'
        );
    });

    it('should return the provided fallback', () => {
        const error = new HttpErrorResponse({ status: 400 });

        expect(
            getApiErrorMessage(error, 'No se pudo registrar la misa.')
        ).toBe('No se pudo registrar la misa.');
    });
});