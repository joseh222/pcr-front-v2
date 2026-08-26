import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Router } from '@angular/router';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { CompraFormStore } from '../../data-access/models/compra-form.store';
import { CompraFormPage } from './compra-form';

describe('CompraFormPage', () => {
    const selectedProveedor = signal<any>(null); const items = signal<any[]>([]); const saveResult = signal<any>(null);
    const storeMock = {
        tiposComprobante: signal<any[]>([{ idTipoComprobanteCompra: 1, codigo: 'FACTURA', nombre: 'Factura', requiereSerie: true, requiereNumero: true, isActive: true }]).asReadonly(),
        loading: signal(false).asReadonly(), loadError: signal<string | null>(null).asReadonly(), proveedorResults: signal<any[]>([]).asReadonly(), proveedorLoading: signal(false).asReadonly(), proveedorError: signal<string | null>(null).asReadonly(), selectedProveedor: selectedProveedor.asReadonly(),
        productoResults: signal<any[]>([]).asReadonly(), productoLoading: signal(false).asReadonly(), productoError: signal<string | null>(null).asReadonly(), items: items.asReadonly(), total: signal(10).asReadonly(), hasInvalidItems: signal(false).asReadonly(), saving: signal(false).asReadonly(), saveError: signal<string | null>(null).asReadonly(), saveResult: saveResult.asReadonly(),
        initialize: vi.fn(), searchProveedores: vi.fn(), selectProveedor: vi.fn(), clearProveedor: vi.fn(), searchProductos: vi.fn(), addProduct: vi.fn(() => 'ADDED'), updateQuantity: vi.fn(), updateCost: vi.fn(), removeProduct: vi.fn(), create: vi.fn(), reset: vi.fn(), clearSaveResult: vi.fn()
    };
    const feedbackMock = { success: vi.fn(), error: vi.fn(), warning: vi.fn() };
    const routerMock = { navigate: vi.fn(() => Promise.resolve(true)) };

    async function createFixture() {
        TestBed.configureTestingModule({ imports: [CompraFormPage], providers: [{ provide: FeedbackService, useValue: feedbackMock }, { provide: Router, useValue: routerMock }] });
        TestBed.overrideComponent(CompraFormPage, { set: { providers: [{ provide: CompraFormStore, useValue: storeMock }] } });
        await TestBed.compileComponents(); const fixture = TestBed.createComponent(CompraFormPage); fixture.detectChanges(); return fixture;
    }

    beforeEach(() => {
        selectedProveedor.set(null); items.set([]); saveResult.set(null); Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        Object.values(feedbackMock).forEach(mock => mock.mockClear()); routerMock.navigate.mockClear();
    });

    it('should initialize new purchase', async () => {
        const fixture = await createFixture(); expect(storeMock.initialize).toHaveBeenCalledOnce(); expect(fixture.nativeElement.textContent).toContain('Nueva compra');
    });

    it('should require series and number for invoice', async () => {
        const fixture = await createFixture(); fixture.componentInstance['form'].controls.idTipoComprobanteCompra.setValue(1);
        expect(fixture.componentInstance['form'].controls.serieComprobante.hasError('required')).toBe(true); expect(fixture.componentInstance['form'].controls.numeroComprobante.hasError('required')).toBe(true);
    });

    it('should return to purchase list after a successful save', async () => {
        const fixture = await createFixture();
        saveResult.set({ idCompra: 10, codCompra: 'CMP2026-000010', mensaje: 'Compra registrada correctamente.' });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(feedbackMock.success).toHaveBeenCalled();
        expect(storeMock.clearSaveResult).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/compras']);
    });

    it('should build purchase request and save', async () => {
        const fixture = await createFixture();
        selectedProveedor.set({ idProveedor: 2, razonSocial: 'Proveedor' }); items.set([{ idProducto: 8, cantidad: 2, costoUnitario: 5, subtotal: 10, cantidadError: null, costoError: null }]);
        fixture.componentInstance['form'].patchValue({ idProveedor: 2, idTipoComprobanteCompra: 1, fechaCompra: fixture.componentInstance['today'], serieComprobante: ' F001 ', numeroComprobante: ' 900001 ', observaciones: ' prueba ' });
        fixture.componentInstance['save']();
        expect(storeMock.create).toHaveBeenCalledWith({ idProveedor: 2, idTipoComprobanteCompra: 1, fechaCompra: fixture.componentInstance['today'], serieComprobante: 'F001', numeroComprobante: '900001', observaciones: 'prueba', items: [{ idProducto: 8, cantidad: 2, costoUnitario: 5 }] });
    });
});
