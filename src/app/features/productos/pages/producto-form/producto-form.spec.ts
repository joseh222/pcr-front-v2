import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { ProductoFormStore } from '../../data-access/models/producto-form.store';
import { ProductoFormPage } from './producto-form';

describe('ProductoFormPage', () => {
    const detail = signal<any>(null);
    const saveError = signal<string | null>(null);
    const saveResult = signal<any>(null);
    const storeMock = {
        categorias: signal<any[]>([{ idCategoriaProducto: 1, nombre: 'Velas' }]).asReadonly(), marcas: signal<any[]>([]).asReadonly(), detail: detail.asReadonly(),
        loading: signal(false).asReadonly(), loadError: signal<string | null>(null).asReadonly(), saving: signal(false).asReadonly(), saveError: saveError.asReadonly(), saveResult: saveResult.asReadonly(),
        initialize: vi.fn(), create: vi.fn(), update: vi.fn(), clearSaveError: vi.fn(), clearSaveResult: vi.fn()
    };
    const feedbackMock = { success: vi.fn(), error: vi.fn(), warning: vi.fn() };
    const dialogMock: any = { open: vi.fn(() => ({ afterClosed: () => EMPTY })) };

    async function createFixture(params: Record<string, string> = {}) {
        TestBed.configureTestingModule({
            imports: [ProductoFormPage],
            providers: [provideRouter([{ path: 'productos', component: ProductoFormPage }, { path: 'productos/:id/movimiento', component: ProductoFormPage }]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(params) } } }, { provide: FeedbackService, useValue: feedbackMock }, { provide: MatDialog, useValue: dialogMock }]
        });
        TestBed.overrideComponent(ProductoFormPage, { set: { providers: [{ provide: ProductoFormStore, useValue: storeMock }, { provide: MatDialog, useValue: dialogMock }] } });
        await TestBed.compileComponents(); const fixture = TestBed.createComponent(ProductoFormPage); fixture.detectChanges(); return fixture;
    }

    beforeEach(() => {
        detail.set(null); saveError.set(null); saveResult.set(null);
        Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        feedbackMock.success.mockClear(); feedbackMock.error.mockClear(); feedbackMock.warning.mockClear(); dialogMock.open.mockClear();
        dialogMock.open.mockReturnValue({ afterClosed: () => EMPTY });
    });

    it('should initialize create mode', async () => {
        const fixture = await createFixture(); expect(storeMock.initialize).toHaveBeenCalledWith(null); expect(fixture.nativeElement.textContent).toContain('Nuevo producto');
    });

    it('should initialize edit mode and patch detail', async () => {
        detail.set({ idProducto: 5, idCategoriaProducto: 1, idMarcaProducto: null, nombre: 'Vela', sku: 'VEL-001', descripcion: 'Vela blanca', precioCompra: 2, precioVenta: 5, stockActual: 10, rowVersion: 'A' });
        const fixture = await createFixture({ id: '5' });
        expect(storeMock.initialize).toHaveBeenCalledWith(5); expect(fixture.componentInstance.form.controls.nombre.value).toBe('Vela'); expect(fixture.nativeElement.textContent).toContain('Stock actual');
    });

    it('should normalize SKU', async () => {
        const fixture = await createFixture(); fixture.componentInstance.form.controls.sku.setValue(' vel 001 '); fixture.componentInstance['normalizeSku']();
        expect(fixture.componentInstance.form.controls.sku.value).toBe('VEL001');
    });

    it('should build a create request and save', async () => {
        const fixture = await createFixture();
        fixture.componentInstance.form.setValue({ idCategoriaProducto: 1, idMarcaProducto: null, nombre: ' Vela ', sku: ' vel-001 ', descripcion: ' Blanca ', precioCompra: 2, precioVenta: 5 });
        fixture.componentInstance['save']();
        expect(storeMock.create).toHaveBeenCalledWith({ idCategoriaProducto: 1, idMarcaProducto: null, nombre: 'Vela', sku: 'VEL-001', descripcion: 'Blanca', precioCompra: 2, precioVenta: 5 });
    });

    it('should offer stock initial after creating a product', async () => {
        dialogMock.open.mockReturnValue({ afterClosed: () => of(true) });
        const fixture = await createFixture();
        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

        saveResult.set({ idProducto: 5, codProducto: 'P2026-00000005', rowVersion: 'A', mensaje: 'Producto registrado correctamente.' });
        fixture.detectChanges();

        expect(dialogMock.open).toHaveBeenCalledOnce();
        expect(navigateSpy).toHaveBeenCalledWith(['/productos', 5, 'movimiento'], { queryParams: { tipo: 'STOCK_INICIAL' } });
        expect(storeMock.clearSaveResult).toHaveBeenCalledOnce();
    });
});
