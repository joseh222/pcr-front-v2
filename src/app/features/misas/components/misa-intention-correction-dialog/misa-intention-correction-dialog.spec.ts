import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MisaApiService } from '../../data-access/misa-api.service';
import { MisaIntentionCorrectionDialog } from './misa-intention-correction-dialog';

describe('MisaIntentionCorrectionDialog', () => {
    const api = { correctIntenciones: vi.fn(() => of({ idMisa: 1, cantidadCorregida: 1, mensaje: 'OK' })) };
    const dialogRef = { close: vi.fn() };
    beforeEach(() => TestBed.configureTestingModule({ imports: [MisaIntentionCorrectionDialog], providers: [{ provide: MisaApiService, useValue: api }, { provide: MatDialogRef, useValue: dialogRef }, { provide: MAT_DIALOG_DATA, useValue: { misas: [{ idMisa: 1, codMisa: 'M1', modalidad: 'PERSONAL', tipo: 'DIFUNTO', intenciones: [{ idIntencion: 10, nombre: 'JUAN', observacion: null }] }] } }] }));
    it('should save corrections without touching sale data', () => { const fixture = TestBed.createComponent(MisaIntentionCorrectionDialog); fixture.componentInstance['save'](); expect(api.correctIntenciones).toHaveBeenCalledWith(1, { intenciones: [{ idIntencion: 10, nombre: 'JUAN', observacion: null }] }); expect(dialogRef.close).toHaveBeenCalledWith(true); });
});
