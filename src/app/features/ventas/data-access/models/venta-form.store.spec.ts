import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PersonaApiService } from '../../../personas/data-access/persona-api.service';
import { VentaApiService } from '../venta-api.service';
import { VentaFormStore } from './venta-form.store';

describe('VentaFormStore', () => {
    const ventaApiMock = {
        getMetodosPago: vi.fn(() => of([{ idMetodoPago: 1, codigo: 'EFECTIVO', nombre: 'Efectivo', isActive: true }])),
        getTiposComprobante: vi.fn(() => of([{ idTipoComprobante: 1, codigo: 'RECIBO', nombre: 'Recibo interno', serieDefault: 'R001', isActive: true }])),
        getSolicitudById: vi.fn(() => of({
            idSolicitudServicio: 50, codSolicitudServicio: 'SS2026-00050', idServicio: 1, codigoServicio: 'MISA', nombreServicio: 'Misa',
            idPersona: 10, numeroDocumento: '12345678', nombreCompleto: 'JOSE HUAMAN', telefono: '999999999', importe: 30,
            createdUtc: '2026-08-20T00:00:00', modoPrecio: 'FIJO', requierePago: true, motivoNoPago: null,
            estadoSolicitud: 'ACTIVA', nombreEstadoSolicitud: 'Activa', estadoPago: 'PENDIENTE', nombreEstadoPago: 'Pendiente',
            observaciones: null, updatedUtc: null, createdById: 1, updatedById: null, motivoAnulacion: null, anuladaUtc: null,
            anuladaById: null, rowVersion: 'AAAA'
        })),
        searchProductos: vi.fn(() => of([])),
        searchServiciosPendientes: vi.fn(() => of([])),
        create: vi.fn(() => of({
            idVenta: 1, codVenta: 'V2026-00001', serie: 'R001', correlativo: 1, numeroComprobante: 'R001-000001',
            fechaVentaUtc: '2026-08-20T00:00:00', subTotal: 30, impuesto: 0, total: 30, estadoVenta: 'EMITIDA', rowVersion: 'AAAA', mensaje: 'Venta registrada.'
        }))
    };

    const personaApiMock = {
        getTiposDocumento: vi.fn(() => of([{ idTipoDocumento: 1, codigo: 'DNI', nombre: 'DNI', longitudMinima: 8, longitudMaxima: 8, soloNumeros: true, isActive: true }])),
        getById: vi.fn(() => of({ idPersona: 10, idTipoDocumento: 1, numeroDocumento: '12345678', nombreCompleto: 'JOSE HUAMAN', telefono: '999999999' })),
        getByDocument: vi.fn(() => of(null)),
        search: vi.fn(() => of([])),
        create: vi.fn(() => of({ idPersona: 20, codPersona: 'PER-20', rowVersion: 'AAAA', mensaje: 'Persona registrada.' }))
    };

    let store: VentaFormStore;

    beforeEach(() => {
        Object.values(ventaApiMock).forEach(mock => mock.mockClear());
        Object.values(personaApiMock).forEach(mock => mock.mockClear());

        TestBed.configureTestingModule({
            providers: [
                VentaFormStore,
                { provide: VentaApiService, useValue: ventaApiMock },
                { provide: PersonaApiService, useValue: personaApiMock }
            ]
        });
        store = TestBed.inject(VentaFormStore);
    });

    it('should initialize catalogs and preload a payable service', () => {
        store.initialize(50);

        expect(ventaApiMock.getSolicitudById).toHaveBeenCalledWith(50);
        expect(store.metodosPago()).toHaveLength(1);
        expect(store.tiposComprobante()).toHaveLength(1);
        expect(store.items()).toHaveLength(1);
        expect(store.items()[0].codigo).toBe('SS2026-00050');
        expect(store.total()).toBe(30);
    });

    it('should reject duplicated products instead of increasing quantity', () => {
        const product = {
            idProducto: 5, codProducto: 'PRD-005', nombre: 'Vela', sku: null, idCategoriaProducto: 1,
            nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 5, stockActual: 20
        };

        expect(store.addProduct(product)).toBe(true);
        expect(store.addProduct(product)).toBe(false);
        expect(store.items()).toHaveLength(1);
        expect(store.items()[0].cantidad).toBe(1);
    });

    it('should reject duplicated services', () => {
        const service = {
            idSolicitudServicio: 12, codSolicitudServicio: 'SS2026-00012', idServicio: 1, codigoServicio: 'MISA', nombreServicio: 'Misa',
            idPersona: 2, numeroDocumento: '12345678', nombreCompleto: 'JUAN PEREZ', telefono: null, importe: 20, createdUtc: '2026-08-20T00:00:00'
        };

        expect(store.addService(service)).toBe(true);
        expect(store.addService(service)).toBe(false);
        expect(store.items()).toHaveLength(1);
    });

    it('should update a product quantity explicitly', () => {
        store.addProduct({
            idProducto: 5, codProducto: 'PRD-005', nombre: 'Vela', sku: null, idCategoriaProducto: 1,
            nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 5, stockActual: 20
        });

        store.updateProductQuantity(5, 3);

        expect(store.items()[0].cantidad).toBe(3);
        expect(store.items()[0].subtotal).toBe(15);
        expect(store.total()).toBe(15);
    });

    it('should create a sale', () => {
        const request = { idPersona: 10, idTipoComprobante: 1, idMetodoPago: 1, observaciones: null, items: [] };
        store.createSale(request);

        expect(ventaApiMock.create).toHaveBeenCalledWith(request);
        expect(store.saving()).toBe(false);
        expect(store.saveResult()?.idVenta).toBe(1);
    });

    it('should keep an invalid negative quantity and block the detail', () => {
        store.addProduct({
            idProducto: 5,
            codProducto: 'P2026-00000005',
            nombre: 'Vela',
            sku: null,
            idCategoriaProducto: 1,
            nombreCategoria: 'Velas',
            idMarcaProducto: null,
            nombreMarca: null,
            precioVenta: 5,
            stockActual: 20
        });

        const message = store.updateProductQuantity(5, -3);
        expect(message).toBe('La cantidad debe ser mayor que cero.');
        expect(store.items()[0].cantidad).toBe(-3);
        expect(store.items()[0].cantidadError).toBe('La cantidad debe ser mayor que cero.');
        expect(store.hasInvalidItems()).toBe(true);
        expect(store.total()).toBe(0);
    });

    it('should invalidate a quantity greater than current stock', () => {
        store.addProduct({
            idProducto: 5,
            codProducto: 'P2026-00000005',
            nombre: 'Vela',
            sku: null,
            idCategoriaProducto: 1,
            nombreCategoria: 'Velas',
            idMarcaProducto: null,
            nombreMarca: null,
            precioVenta: 5,
            stockActual: 2
        });

        const message = store.updateProductQuantity(5, 3);
        expect(message).toBe('Stock disponible: 2.');
        expect(store.hasInvalidItems()).toBe(true);
    });

    it('should invalidate a negative product quantity', () => {
        store.addProduct({
            idProducto: 5,
            codProducto: 'PRD-005',
            nombre: 'Vela',
            sku: null,
            idCategoriaProducto: 1,
            nombreCategoria: 'Velas',
            idMarcaProducto: null,
            nombreMarca: null,
            precioVenta: 5,
            stockActual: 20
        });

        expect(store.updateProductQuantity(5, -3))
            .toBe('La cantidad debe ser mayor que cero.');

        expect(store.items()[0].cantidad).toBe(-3);
        expect(store.items()[0].cantidadError)
            .toBe('La cantidad debe ser mayor que cero.');
        expect(store.hasInvalidItems()).toBe(true);
        expect(store.total()).toBe(0);
    });

    it('should invalidate a quantity greater than stock', () => {
        store.addProduct({
            idProducto: 5,
            codProducto: 'PRD-005',
            nombre: 'Vela',
            sku: null,
            idCategoriaProducto: 1,
            nombreCategoria: 'Velas',
            idMarcaProducto: null,
            nombreMarca: null,
            precioVenta: 5,
            stockActual: 2
        });

        expect(store.updateProductQuantity(5, 3))
            .toBe('Stock disponible: 2.');

        expect(store.hasInvalidItems()).toBe(true);
        expect(store.total()).toBe(0);
    });
});