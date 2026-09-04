import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MisaReopenProgramDialog } from './misa-reopen-program-dialog';

describe('MisaReopenProgramDialog', () => {
    const dialogRef = { close: vi.fn() };

    beforeEach(() => {
        vi.clearAllMocks();
        TestBed.configureTestingModule({
            imports: [MisaReopenProgramDialog],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { fechaLabel: 'Viernes 04 de septiembre de 2026', hora: '18:00', versionActual: 1 } },
                { provide: MatDialogRef, useValue: dialogRef }
            ]
        });
    });

    it('requires a reopening reason', () => {
        const fixture = TestBed.createComponent(MisaReopenProgramDialog);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.confirm();
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('returns the trimmed reason', () => {
        const fixture = TestBed.createComponent(MisaReopenProgramDialog);
        fixture.detectChanges();
        const component = fixture.componentInstance as any;
        component.form.controls.motivo.setValue('  Misa solicitada por el sacerdote  ');
        component.confirm();
        expect(dialogRef.close).toHaveBeenCalledWith('Misa solicitada por el sacerdote');
    });
});
