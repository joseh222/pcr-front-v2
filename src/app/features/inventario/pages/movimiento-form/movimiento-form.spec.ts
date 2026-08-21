import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { InventarioMovementStore } from '../../data-access/models/inventario-movement.store';
import { MovimientoFormPage } from './movimiento-form';

describe('MovimientoFormPage', () => {
    const inventory = signal<any>({ idProducto: 5, codProducto: 'P2026-00000005', nombre: 'Vela', sku: 'VEL-001', stockActual: 10, fechaUltimoMovimiento: '2026-08-20T12:00:00Z' });
    const types = signal<any[]>([
        { idTipoMovimiento: 1, codigo: 'STOCK_INICIAL', nombre: 'Stock inicial', naturaleza: 'E', permiteRegistroManual: true },
        { idTipoMovimiento: 2, codigo: 'AJUSTE_ENTRADA', nombre: 'Ajuste entrada', naturaleza: 'E', permiteRegistroManual: true },
        { idTipoMovimiento: 3, codigo: 'AJUSTE_SALIDA', nombre: 'Ajuste salida', naturaleza: 'S', permiteRegistroManual: true }
    ]);
    const saveError = signal<string | null>(null);
    const saveResult = signal<any>(null);
    const storeMock = {
        inventory: inventory.asReadonly(), tipos: types.asReadonly(), loading: signal(false).asReadonly(), loadError: signal<string | null>(null).asReadonly(), saving: signal(false).asReadonly(),
        saveError: saveError.asReadonly(), saveResult: saveResult.asReadonly(), initialize: vi.fn(), create: vi.fn(), clearSaveError: vi.fn(), clearSaveResult: vi.fn()
    };
    const feedbackMock = { success: vi.fn(), error: vi.fn(), warning: vi.fn() };

    async function createFixture(query: Record<string, string> = {}) {
        TestBed.configureTestingModule({
            imports: [MovimientoFormPage],
            providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '5' }), queryParamMap: convertToParamMap(query) } } }, { provide: FeedbackService, useValue: feedbackMock }]
        });
        TestBed.overrideComponent(MovimientoFormPage, { set: { providers: [{ provide: InventarioMovementStore, useValue: storeMock }] } });
        await TestBed.compileComponents(); const fixture = TestBed.createComponent(MovimientoFormPage); fixture.detectChanges(); return fixture;
    }

    beforeEach(() => {
        inventory.set({ idProducto: 5, codProducto: 'P2026-00000005', nombre: 'Vela', sku: 'VEL-001', stockActual: 10, fechaUltimoMovimiento: '2026-08-20T12:00:00Z' });
        saveError.set(null); saveResult.set(null); storeMock.initialize.mockClear(); storeMock.create.mockClear(); storeMock.clearSaveError.mockClear(); storeMock.clearSaveResult.mockClear();
        feedbackMock.success.mockClear(); feedbackMock.error.mockClear(); feedbackMock.warning.mockClear();
    });

    it('should initialize inventory movement', async () => {
        const fixture = await createFixture();
        expect(storeMock.initialize).toHaveBeenCalledWith(5);
        expect(fixture.nativeElement.textContent).toContain('Registrar movimiento');
    });

    it('should hide stock initial when product already has movements', async () => {
        const fixture = await createFixture();
        expect(fixture.componentInstance['availableTypes']().some((item: any) => item.codigo === 'STOCK_INICIAL')).toBe(false);
    });

    it('should require reason for adjustment and calculate projected stock', async () => {
        const fixture = await createFixture(); const component = fixture.componentInstance;
        component.form.controls.idTipoMovimiento.setValue(2); component.form.controls.cantidad.setValue(5);
        expect(component.form.controls.motivo.hasError('required')).toBe(true);
        expect(component['projectedStock']()).toBe(15);
    });

    it('should block output greater than stock', async () => {
        const fixture = await createFixture(); const component = fixture.componentInstance;
        component.form.controls.idTipoMovimiento.setValue(3); component.form.controls.cantidad.setValue(11); component.form.controls.motivo.setValue('Ajuste');
        expect(component['hasInsufficientStock']()).toBe(true);
        expect(component['canSave']()).toBe(false);
        component['save']();
        expect(feedbackMock.warning).toHaveBeenCalledWith('Stock insuficiente para realizar el movimiento.');
        expect(storeMock.create).not.toHaveBeenCalled();
    });


    it('should lock movement type in initial stock flow', async () => {
        inventory.set({ idProducto: 5, codProducto: 'P2026-00000005', nombre: 'Vela', sku: 'VEL-001', stockActual: 0, fechaUltimoMovimiento: null });
        const fixture = await createFixture({ tipo: 'STOCK_INICIAL' });
        expect(fixture.componentInstance.form.controls.idTipoMovimiento.value).toBe(1);
        expect(fixture.componentInstance.form.controls.idTipoMovimiento.disabled).toBe(true);
    });

    it('should create a valid movement', async () => {
        const fixture = await createFixture(); const component = fixture.componentInstance;
        component.form.setValue({ idTipoMovimiento: 2, cantidad: 5, costoUnitario: 2.5, motivo: ' Reposición ' });
        component['save']();
        expect(storeMock.create).toHaveBeenCalledWith(5, { idTipoMovimiento: 2, cantidad: 5, costoUnitario: 2.5, motivo: 'Reposición' });
    });
});
