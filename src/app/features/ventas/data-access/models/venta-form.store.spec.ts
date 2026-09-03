import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VentaApiService } from '../venta-api.service';
import { VentaFormStore } from './venta-form.store';
import { VentaSolicitudPendiente } from './venta-lookup.models';

const payableService = (overrides: Partial<VentaSolicitudPendiente> = {}): VentaSolicitudPendiente => ({
    idSolicitudServicio: 50,
    codSolicitudServicio: 'SS2026-000050',
    idServicio: 2,
    codigoServicio: 'CONSTANCIA_BAUTISMO',
    nombreServicio: 'Constancia de Bautismo',
    idPersona: 10,
    numeroDocumento: '12345678',
    nombreCompleto: 'JOSE HUAMAN',
    telefono: '999999999',
    requierePago: true,
    cantidad: 3,
    importe: 30,
    importeTotal: 90,
    estadoSolicitud: 'ACTIVA',
    estadoPago: 'PENDIENTE',
    idTipoSacramentoRequerido: 1,
    codigoTipoSacramentoRequerido: 'BAUTISMO',
    nombreTipoSacramentoRequerido: 'Bautismo',
    requiereRegistroSacramental: true,
    tieneRegistroSacramental: true,
    codigoTipoSacramentoRegistro: 'BAUTISMO',
    idRegistroSacramental: 25,
    nombreRegistroSacramental: 'JOSE HUAMAN',
    numeroLibroRegistro: '20',
    numeroFolioRegistro: '35',
    numeroPartidaRegistro: '180',
    puedeCobrar: true,
    motivoNoCobrable: null,
    createdUtc: '2026-09-03T00:00:00',
    ...overrides
});

describe('VentaFormStore', () => {
    const ventaApiMock = {
        getMetodosPago: vi.fn(() => of([{ idMetodoPago: 1, codigo: 'EFECTIVO', nombre: 'Efectivo', isActive: true }])),
        getTiposComprobante: vi.fn(() => of([{ idTipoComprobante: 1, codigo: 'RECIBO', nombre: 'Recibo interno', serieDefault: 'R001', isActive: true }])),
        getPersonaTiposDocumento: vi.fn(() => of([{ idTipoDocumento: 1, codigo: 'DNI', nombre: 'DNI', longitudMinima: 8, longitudMaxima: 8, soloNumeros: true, isActive: true }])),
        getPersonaById: vi.fn(() => of({ idPersona: 10, idTipoDocumento: 1, numeroDocumento: '12345678', nombreCompleto: 'JOSE HUAMAN', telefono: '999999999' })),
        getPersonaByDocument: vi.fn(() => of(null)),
        searchPersonas: vi.fn(() => of([])),
        getSolicitudById: vi.fn(() => of({
            ...payableService(),
            modoPrecio: 'FIJO', motivoNoPago: null, nombreEstadoSolicitud: 'Activa', nombreEstadoPago: 'Pendiente',
            observaciones: null, updatedUtc: null, createdById: 1, updatedById: null, motivoAnulacion: null, anuladaUtc: null,
            anuladaById: null, rowVersion: 'AAAA'
        })),
        searchProductos: vi.fn(() => of([])),
        searchServiciosPendientes: vi.fn(() => of([])),
        create: vi.fn(() => of({
            idVenta: 1, codVenta: 'V2026-00001', serie: 'R001', correlativo: 1, numeroComprobante: 'R001-000001',
            fechaVentaUtc: '2026-09-03T00:00:00', subTotal: 90, impuesto: 0, total: 90, estadoVenta: 'EMITIDA', rowVersion: 'AAAA', mensaje: 'Venta registrada.'
        })),
        createPersona: vi.fn(() => of({ idPersona: 20, codPersona: 'PER-20', rowVersion: 'AAAA', mensaje: 'Persona registrada.' }))
    };

    let store: VentaFormStore;

    beforeEach(() => {
        Object.values(ventaApiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [VentaFormStore, { provide: VentaApiService, useValue: ventaApiMock }] });
        store = TestBed.inject(VentaFormStore);
    });

    it('should preload the SS quantity and total from Gestión de Servicios', () => {
        store.initialize(50);
        expect(ventaApiMock.getSolicitudById).toHaveBeenCalledWith(50);
        expect(store.items()).toHaveLength(1);
        expect(store.items()[0].codigo).toBe('SS2026-000050');
        expect(store.items()[0].cantidad).toBe(3);
        expect(store.items()[0].precioUnitario).toBe(30);
        expect(store.items()[0].subtotal).toBe(90);
        expect(store.total()).toBe(90);
    });

    it('should not preload a sacramental SS that is not ready for payment', () => {
        ventaApiMock.getSolicitudById.mockReturnValueOnce(of({
            ...payableService({ puedeCobrar: false, tieneRegistroSacramental: false, motivoNoCobrable: 'Debe asociar el registro sacramental antes de cobrar.' }),
            modoPrecio: 'FIJO', motivoNoPago: null, nombreEstadoSolicitud: 'Activa', nombreEstadoPago: 'Pendiente',
            observaciones: null, updatedUtc: null, createdById: 1, updatedById: null, motivoAnulacion: null, anuladaUtc: null, anuladaById: null, rowVersion: 'AAAA'
        }));
        store.initialize(50);
        expect(store.items()).toHaveLength(0);
        expect(store.error()).toContain('ya no se encuentra disponible');
    });

    it('should reject duplicated products instead of increasing quantity', () => {
        const product = { idProducto: 5, codProducto: 'PRD-005', nombre: 'Vela', sku: null, idCategoriaProducto: 1, nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 5, stockActual: 20 };
        expect(store.addProduct(product)).toBe(true);
        expect(store.addProduct(product)).toBe(false);
        expect(store.items()).toHaveLength(1);
        expect(store.items()[0].cantidad).toBe(1);
    });

    it('should reject duplicated services', () => {
        const service = payableService({ idSolicitudServicio: 12, codSolicitudServicio: 'SS2026-000012', cantidad: 1, importe: 20, importeTotal: 20 });
        expect(store.addService(service)).toBe(true);
        expect(store.addService(service)).toBe(false);
        expect(store.items()).toHaveLength(1);
    });

    it('should update a product quantity explicitly', () => {
        store.addProduct({ idProducto: 5, codProducto: 'PRD-005', nombre: 'Vela', sku: null, idCategoriaProducto: 1, nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 5, stockActual: 20 });
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

    it('should keep invalid product quantity and block the detail', () => {
        store.addProduct({ idProducto: 5, codProducto: 'PRD-005', nombre: 'Vela', sku: null, idCategoriaProducto: 1, nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 5, stockActual: 20 });
        expect(store.updateProductQuantity(5, -3)).toBe('La cantidad debe ser mayor que cero.');
        expect(store.items()[0].cantidad).toBe(-3);
        expect(store.hasInvalidItems()).toBe(true);
        expect(store.total()).toBe(0);
    });

    it('should invalidate a quantity greater than stock', () => {
        store.addProduct({ idProducto: 5, codProducto: 'PRD-005', nombre: 'Vela', sku: null, idCategoriaProducto: 1, nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 5, stockActual: 2 });
        expect(store.updateProductQuantity(5, 3)).toBe('Stock disponible: 2.');
        expect(store.hasInvalidItems()).toBe(true);
        expect(store.total()).toBe(0);
    });
});
