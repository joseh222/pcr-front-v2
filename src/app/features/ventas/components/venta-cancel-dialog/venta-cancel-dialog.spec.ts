import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentaCancelDialog } from './venta-cancel-dialog';

describe('VentaCancelDialog', () => {
    const dialogRefMock = {
        close: vi.fn()
    };

    beforeEach(() => {
        dialogRefMock.close.mockClear();

        TestBed.configureTestingModule({
            imports: [VentaCancelDialog],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        codVenta: 'V2026-00015',
                        rowVersion: 'AAAAAAAABQ=',
                        razones: [{
                            idRazonAnulacion: 1,
                            codigo: 'ERROR_COBRO',
                            nombre: 'Error de cobro',
                            requiereDetalle: true,
                            isActive: true
                        }]
                    }
                },
                {
                    provide: MatDialogRef,
                    useValue: dialogRefMock
                }
            ]
        });
    });

    it('should require detail when selected reason requires it', () => {
        const fixture = TestBed.createComponent(VentaCancelDialog);
        const component = fixture.componentInstance;

        component['form'].controls.idRazonAnulacion.setValue(1);

        expect(
            component['form'].controls.motivoAnulacion.hasError('required')
        ).toBe(true);
    });

    it('should close with cancellation request', () => {
        const fixture = TestBed.createComponent(VentaCancelDialog);
        const component = fixture.componentInstance;

        component['form'].setValue({
            idRazonAnulacion: 1,
            motivoAnulacion: 'Cobro duplicado'
        });

        component['confirm']();

        expect(dialogRefMock.close).toHaveBeenCalledWith({
            idRazonAnulacion: 1,
            motivoAnulacion: 'Cobro duplicado',
            rowVersion: 'AAAAAAAABQ='
        });
    });
});