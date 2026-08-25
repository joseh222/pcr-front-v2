import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SolicitudServicioCancelDialog } from './solicitud-servicio-cancel-dialog';

describe('SolicitudServicioCancelDialog', () => {
    const dialogRef = { close: vi.fn() };
    beforeEach(() => {
        dialogRef.close.mockClear();
        TestBed.configureTestingModule({ imports: [SolicitudServicioCancelDialog], providers: [
            { provide: MAT_DIALOG_DATA, useValue: { codSolicitudServicio: 'SS2026-00010', rowVersion: 'A' } },
            { provide: MatDialogRef, useValue: dialogRef }
        ] });
    });

    it('should require a reason', () => {
        const fixture = TestBed.createComponent(SolicitudServicioCancelDialog); const component = fixture.componentInstance;
        component['confirm'](); expect(dialogRef.close).not.toHaveBeenCalled();
        component['form'].controls.motivo.setValue('Cancelado por solicitante'); component['confirm']();
        expect(dialogRef.close).toHaveBeenCalledWith({ motivo: 'Cancelado por solicitante', rowVersion: 'A' });
    });
});
