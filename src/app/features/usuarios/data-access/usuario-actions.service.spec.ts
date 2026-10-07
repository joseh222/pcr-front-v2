import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FeedbackService } from '../../../core/feedback/feedback.service';
import { UsuarioApiService } from './usuario-api.service';
import { UsuarioActionsService } from './usuario-actions.service';

describe('UsuarioActionsService', () => {
    const user = { idUser: 8, username: 'TEST', nombreCompleto: 'Usuario Test', isActive: true };
    let api: { getById: ReturnType<typeof vi.fn>; changeStatus: ReturnType<typeof vi.fn>; resetPassword: ReturnType<typeof vi.fn>; revokeSession: ReturnType<typeof vi.fn> };
    let dialog: { open: ReturnType<typeof vi.fn> }; let feedback: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        api = { getById: vi.fn(() => of({ rowVersion: 'rv-2' })), changeStatus: vi.fn(() => of({ mensaje: 'Estado actualizado' })), resetPassword: vi.fn(() => of({ username: 'TEST', temporaryPassword: 'Tmp#1234', mensaje: 'Clave generada' })), revokeSession: vi.fn(() => of({ mensaje: 'Sesiones revocadas' })) };
        dialog = { open: vi.fn(() => ({ afterClosed: () => of(true) })) }; feedback = { success: vi.fn(), error: vi.fn() };
        TestBed.configureTestingModule({ providers: [UsuarioActionsService, { provide: UsuarioApiService, useValue: api }, { provide: MatDialog, useValue: dialog }, { provide: FeedbackService, useValue: feedback }] });
    });

    it('should obtain a fresh rowVersion before changing status', () => {
        TestBed.inject(UsuarioActionsService).changeStatus(user).subscribe(changed => expect(changed).toBe(true));
        expect(api.getById).toHaveBeenCalledWith(8); expect(api.changeStatus).toHaveBeenCalledWith(8, false, 'rv-2');
    });

    it('should reset the password after confirmation', () => {
        TestBed.inject(UsuarioActionsService).resetPassword(user).subscribe(changed => expect(changed).toBe(true));
        expect(api.resetPassword).toHaveBeenCalledWith(8); expect(dialog.open).toHaveBeenCalledTimes(2);
    });

    it('should revoke sessions after confirmation', () => {
        TestBed.inject(UsuarioActionsService).revokeSession(user).subscribe(changed => expect(changed).toBe(true));
        expect(api.revokeSession).toHaveBeenCalledWith(8); expect(feedback.success).toHaveBeenCalled();
    });
});
