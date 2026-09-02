import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { LibroSacramentalActionsService } from './libro-sacramental-actions.service';
import { LibroSacramentalApiService } from './libro-sacramental-api.service';

describe('LibroSacramentalActionsService', () => {
    const book: any = { idLibroSacramental: 7, numeroLibro: '11' }; const api = { changePhysicalStatus: vi.fn(() => of({ mensaje: 'Estado físico actualizado.' })), changeDigitizationStatus: vi.fn(() => of({ mensaje: 'Digitalización actualizada.' })), reopenDigitization: vi.fn(() => of({ mensaje: 'Digitalización reabierta.' })) }; const dialog = { open: vi.fn(() => ({ afterClosed: () => of(true) })) }; const feedback = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
    beforeEach(() => { Object.values(api).forEach(mock => mock.mockClear()); dialog.open.mockClear(); feedback.success.mockClear(); TestBed.configureTestingModule({ providers: [LibroSacramentalActionsService, { provide: LibroSacramentalApiService, useValue: api }, { provide: MatDialog, useValue: dialog }, { provide: FeedbackService, useValue: feedback }] }); });
    it('should require confirmation before closing the physical book', () => { const service = TestBed.inject(LibroSacramentalActionsService); service.changePhysicalStatus(book, 'CERRADO').subscribe(result => expect(result).toBe(true)); expect(dialog.open).toHaveBeenCalled(); expect(api.changePhysicalStatus).toHaveBeenCalledWith(7, 'CERRADO'); expect(feedback.success).toHaveBeenCalled(); });
    it('should use the dedicated endpoint when reopening digitization', () => { const service = TestBed.inject(LibroSacramentalActionsService); service.reopenDigitization(book).subscribe(result => expect(result).toBe(true)); expect(api.reopenDigitization).toHaveBeenCalledWith(7); });
});
