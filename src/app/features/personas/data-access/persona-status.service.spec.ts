import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { PersonaApiService } from './persona-api.service';
import { PersonaStatusService } from './persona-status.service';

describe('PersonaStatusService', () => {
    const apiMock = {
        changeStatus: vi.fn(() => of({ idPersona: 5, isActive: false, rowVersion: 'B', mensaje: 'Persona desactivada correctamente.' }))
    };
    const dialogMock = { open: vi.fn(() => ({ afterClosed: () => of(true) })) };
    const feedbackMock = { success: vi.fn(), error: vi.fn() };

    beforeEach(() => {
        apiMock.changeStatus.mockClear();
        dialogMock.open.mockClear();
        feedbackMock.success.mockClear();
        feedbackMock.error.mockClear();
        TestBed.configureTestingModule({
            providers: [
                PersonaStatusService,
                { provide: PersonaApiService, useValue: apiMock },
                { provide: MatDialog, useValue: dialogMock },
                { provide: FeedbackService, useValue: feedbackMock }
            ]
        });
    });

    it('should deactivate an active person after confirmation', () => {
        const service = TestBed.inject(PersonaStatusService);
        let changed = false;
        service.change({
            idPersona: 5, codPersona: 'PER2026-000005', nombreCompleto: 'JUAN PEREZ',
            isActive: true, rowVersion: 'A'
        }).subscribe(result => changed = result);

        expect(apiMock.changeStatus).toHaveBeenCalledWith(5, { isActive: false, rowVersion: 'A' });
        expect(feedbackMock.success).toHaveBeenCalled();
        expect(changed).toBe(true);
    });

    it('should not call api when confirmation is cancelled', () => {
        dialogMock.open.mockReturnValueOnce({ afterClosed: () => of(false) } as any);
        const service = TestBed.inject(PersonaStatusService);
        service.change({
            idPersona: 5, codPersona: 'PER2026-000005', nombreCompleto: 'JUAN PEREZ',
            isActive: true, rowVersion: 'A'
        }).subscribe();

        expect(apiMock.changeStatus).not.toHaveBeenCalled();
    });
});
