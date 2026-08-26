import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompraCancelDialog } from './compra-cancel-dialog';

describe('CompraCancelDialog', () => {
    const dialogRef = { close: vi.fn() };

    beforeEach(() => {
        dialogRef.close.mockClear();
        TestBed.configureTestingModule({ imports: [CompraCancelDialog], providers: [
            { provide: MAT_DIALOG_DATA, useValue: { codCompra: 'CMP2026-000005', rowVersion: 'A' } },
            { provide: MatDialogRef, useValue: dialogRef }
        ] });
    });

    it('should require a cancellation reason', () => {
        const fixture = TestBed.createComponent(CompraCancelDialog); const component = fixture.componentInstance;
        component['confirm'](); expect(dialogRef.close).not.toHaveBeenCalled();
        component['form'].controls.motivoAnulacion.setValue('Compra registrada por error'); component['confirm']();
        expect(dialogRef.close).toHaveBeenCalledWith({ motivoAnulacion: 'Compra registrada por error', rowVersion: 'A' });
    });
});
