import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemporaryPasswordDialog } from './temporary-password-dialog';

describe('TemporaryPasswordDialog', () => {
    let fixture: ComponentFixture<TemporaryPasswordDialog>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TemporaryPasswordDialog], providers: [{ provide: MAT_DIALOG_DATA, useValue: { title: 'Usuario creado', username: 'jose', temporaryPassword: 'Tmp#1234' } }, { provide: MatDialogRef, useValue: {} }] }).compileComponents();
        fixture = TestBed.createComponent(TemporaryPasswordDialog); fixture.detectChanges();
    });
    it('should show the temporary credentials', () => { expect(fixture.nativeElement.textContent).toContain('jose'); expect(fixture.nativeElement.textContent).toContain('Tmp#1234'); });
});
