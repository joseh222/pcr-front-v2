import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';

import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { VentaFormStore } from '../../data-access/models/venta-form.store';
import { VentaFormPage } from './venta-form';
import { AuthStore } from '../../../auth/data-access/auth.store';

const authStoreMock = { hasPermission: vi.fn(() => true) };

describe('VentaFormPage', () => {
    const loading = signal(false);
    const error = signal<string | null>(null);
    const metodosPago = signal([{ idMetodoPago: 1, codigo: 'EFECTIVO', nombre: 'Efectivo', isActive: true }]);
    const tiposComprobante = signal([{ idTipoComprobante: 1, codigo: 'RECIBO', nombre: 'Recibo interno', serieDefault: 'R001', isActive: true }]);
    const tiposDocumento = signal([{ idTipoDocumento: 1, codigo: 'DNI', nombre: 'DNI', longitudMinima: 8, longitudMaxima: 8, soloNumeros: true, isActive: true }]);
    const initialPerson = signal<any>(null);
    const documentPerson = signal<any>(null);
    const productResults = signal<any[]>([]);
    const serviceResults = signal<any[]>([]);
    const personResults = signal<any[]>([]);
    const items = signal<any[]>([]);
    const total = signal(0);
    const saving = signal(false);
    const saveError = signal<string | null>(null);
    const saveResult = signal<any>(null);
    const createdPerson = signal<any>(null);
    const createPersonError = signal<string | null>(null);
    const hasInvalidItems = signal(false);

    const storeMock = {
        loading: loading.asReadonly(), error: error.asReadonly(), metodosPago: metodosPago.asReadonly(), tiposComprobante: tiposComprobante.asReadonly(),
        tiposDocumento: tiposDocumento.asReadonly(), initialPerson: initialPerson.asReadonly(), documentPerson: documentPerson.asReadonly(),
        documentLoading: signal(false).asReadonly(), productResults: productResults.asReadonly(), productLoading: signal(false).asReadonly(),
        serviceResults: serviceResults.asReadonly(), serviceLoading: signal(false).asReadonly(), personResults: personResults.asReadonly(),
        creatingPerson: signal(false).asReadonly(), createdPerson: createdPerson.asReadonly(), createPersonError: createPersonError.asReadonly(),
        items: items.asReadonly(), total: total.asReadonly(), saving: saving.asReadonly(), saveError: saveError.asReadonly(), saveResult: saveResult.asReadonly(),
        initialize: vi.fn(), searchProducts: vi.fn(), searchServices: vi.fn(), searchPersons: vi.fn(), findPersonByDocument: vi.fn(), createPerson: vi.fn(),
        addProduct: vi.fn(() => true), addService: vi.fn(() => true), updateProductQuantity: vi.fn(() => null), removeItem: vi.fn(), clearProductSearch: vi.fn(),
        clearServiceSearch: vi.fn(), clearPersonSearch: vi.fn(), clearDocumentPerson: vi.fn(), clearCreatedPerson: vi.fn(), createSale: vi.fn(), clearSaveResult: vi.fn(),
        hasInvalidItems: hasInvalidItems.asReadonly()
    };

    const feedbackMock = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };

    beforeEach(() => {
        initialPerson.set(null); documentPerson.set(null); productResults.set([]); serviceResults.set([]); personResults.set([]); items.set([]); total.set(0);
        saving.set(false); saveError.set(null); saveResult.set(null); createdPerson.set(null); createPersonError.set(null);
        Object.values(storeMock).forEach(value => { if (typeof value === 'function' && 'mockClear' in value) (value as any).mockClear(); });
        Object.values(feedbackMock).forEach(mock => mock.mockClear());
        storeMock.addProduct.mockReturnValue(true); storeMock.addService.mockReturnValue(true);
        hasInvalidItems.set(false);
    });

    it('should initialize without an initial service', async () => {
        const fixture = await createFixture({});
        expect(storeMock.initialize).toHaveBeenCalledWith(null);
        expect(fixture.nativeElement.textContent).toContain('Nueva venta');
    });

    it('should initialize from a service id', async () => {
        await createFixture({ solicitudServicioId: '50', origen: 'misa' });
        expect(storeMock.initialize).toHaveBeenCalledWith(50);
    });

    it('should return to services after saving a sale from a service request', async () => {
        const fixture = await createFixture({ origen: 'servicio' });
        const router = TestBed.inject(Router);
        const navigate = vi.spyOn(router, 'navigate');
        saveResult.set({ mensaje: 'Venta registrada.', numeroComprobante: 'R001-000001' });
        fixture.detectChanges();
        expect(navigate).toHaveBeenCalledWith(['/servicios']);
    });

    it('should warn instead of adding a duplicated product', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;
        storeMock.addProduct.mockReturnValue(false);

        component['selectProduct']({
            idProducto: 5, codProducto: 'PRD-005', nombre: 'Vela', sku: null, idCategoriaProducto: 1, nombreCategoria: 'Velas',
            idMarcaProducto: null, nombreMarca: null, precioVenta: 5, stockActual: 10
        });

        expect(feedbackMock.warning).toHaveBeenCalledWith('El producto ya se encuentra en el detalle de venta.');
    });

    it('should calculate cash change visually', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;
        total.set(42);
        component['form'].patchValue({ idMetodoPago: 1, montoRecibido: 50 });
        fixture.detectChanges();

        expect(component['changeAmount']()).toBe(8);
        expect(component['missingAmount']()).toBe(0);
    });

    it('should not include received amount in the sale request', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;
        items.set([{
            key: 'SERVICIO-50',
            tipoItem: 'SERVICIO',
            idProducto: null,
            idSolicitudServicio: 50,
            codigo: 'SS2026-00050',
            referencia: 'MISA',
            descripcion: 'Misa',
            solicitante: 'JOSE',
            cantidad: 1,
            precioUnitario: 30,
            stockActual: null,
            subtotal: 30,
            cantidadError: null
        }]);
        total.set(30);
        component['form'].patchValue({ idPersona: 10, idTipoComprobante: 1, idMetodoPago: 1, montoRecibido: 50, observaciones: 'OK' });

        const request = component['buildRequest']();

        expect(request).toEqual({
            idPersona: 10, idTipoComprobante: 1, idMetodoPago: 1, observaciones: 'OK',
            items: [{ tipoItem: 'SERVICIO', idProducto: null, idSolicitudServicio: 50, cantidad: 1 }]
        });
        expect('montoRecibido' in request).toBe(false);
    });

    it('should block saving when received cash is lower than the total', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;
        items.set([
            {
                key: 'SERVICIO-50',
                tipoItem: 'SERVICIO',
                idProducto: null,
                idSolicitudServicio: 50,
                codigo: 'SS2026-00050',
                referencia: 'MISA',
                descripcion: 'Misa',
                solicitante: 'JOSE',
                cantidad: 1,
                precioUnitario: 30,
                stockActual: null,
                subtotal: 30,
                cantidadError: null
            }
        ]);

        total.set(30);

        component['form'].patchValue({
            idPersona: 10,
            nombre: 'JOSE',
            idTipoComprobante: 1,
            idMetodoPago: 1,
            montoRecibido: 20
        });

        expect(component['canSave']()).toBe(false);
        component['save']();
        expect(feedbackMock.warning).toHaveBeenCalledWith('Falta S/ 10.00 para completar el pago.');
        expect(storeMock.createSale).not.toHaveBeenCalled();
    });

    it('should block saving with invalid detail quantities', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        items.set([{
            key: 'PRODUCTO-5',
            tipoItem: 'PRODUCTO',
            idProducto: 5,
            idSolicitudServicio: null,
            codigo: 'PRD-005',
            referencia: null,
            descripcion: 'Vela',
            solicitante: null,
            cantidad: -2,
            precioUnitario: 5,
            stockActual: 10,
            subtotal: 0,
            cantidadError: 'La cantidad debe ser mayor que cero.'
        }]);

        hasInvalidItems.set(true);

        component['form'].patchValue({
            idPersona: 10,
            nombre: 'JOSE',
            idTipoComprobante: 1,
            idMetodoPago: 1,
            montoRecibido: 20
        });

        expect(component['canSave']()).toBe(false);

        component['save']();

        expect(feedbackMock.warning).toHaveBeenCalledWith(
            'Corrige las cantidades inválidas del detalle de venta.'
        );

        expect(storeMock.createSale).not.toHaveBeenCalled();
    });

    it('should block saving when received cash is lower than total', async () => {
        const fixture = await createFixture({});
        const component = fixture.componentInstance;

        items.set([{
            key: 'SERVICIO-50',
            tipoItem: 'SERVICIO',
            idProducto: null,
            idSolicitudServicio: 50,
            codigo: 'SS2026-00050',
            referencia: 'MISA',
            descripcion: 'Misa',
            solicitante: 'JOSE',
            cantidad: 1,
            precioUnitario: 30,
            stockActual: null,
            subtotal: 30,
            cantidadError: null
        }]);

        total.set(30);

        component['form'].patchValue({
            idPersona: 10,
            nombre: 'JOSE',
            idTipoComprobante: 1,
            idMetodoPago: 1,
            montoRecibido: 20
        });

        expect(component['canSave']()).toBe(false);

        component['save']();

        expect(feedbackMock.warning).toHaveBeenCalledWith(
            'Falta S/ 10.00 para completar el pago.'
        );

        expect(storeMock.createSale).not.toHaveBeenCalled();
    });

    async function createFixture(queryParams: Record<string, string>) {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [VentaFormPage],
            providers: [{ provide: AuthStore, useValue: authStoreMock }, 
                provideRouter([]),
                { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(queryParams) } } },
                { provide: FeedbackService, useValue: feedbackMock }
            ]
        });
        TestBed.overrideComponent(VentaFormPage, { set: { providers: [{ provide: VentaFormStore, useValue: storeMock }] } });
        await TestBed.compileComponents();
        const fixture = TestBed.createComponent(VentaFormPage);
        fixture.detectChanges();
        return fixture;
    }
});
