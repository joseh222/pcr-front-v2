import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmActionDialog } from './confirm-action-dialog';

describe('ConfirmActionDialog', () => {
    it('should render the configured confirmation', async () => {
        TestBed.configureTestingModule({
            imports: [ConfirmActionDialog],
            providers: [{
                provide: MAT_DIALOG_DATA,
                useValue: { title: 'Misa registrada', message: '¿Vender ahora?', cancelText: 'Más tarde', confirmText: 'Vender ahora' }
            }]
        });
        await TestBed.compileComponents();
        const fixture = TestBed.createComponent(ConfirmActionDialog);
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Misa registrada');
        expect(fixture.nativeElement.textContent).toContain('Vender ahora');
    });
});
