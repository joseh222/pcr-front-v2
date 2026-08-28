import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CompraApiService } from '../compra-api.service';
import { CompraFormStore } from './compra-form.store';

describe('CompraFormStore', () => {
    const apiMock = {
        getTiposComprobante: vi.fn(() => of([{ idTipoComprobanteCompra: 1, codigo: 'FACTURA', nombre: 'Factura', requiereSerie: true, requiereNumero: true, isActive: true }])),
        searchProveedores: vi.fn(() => of([{ idProveedor: 2, codProveedor: 'PRV2', razonSocial: 'Proveedor', isActive: true }])),
        searchProductos: vi.fn(() => of([{ idProducto: 8, codProducto: 'P8', nombre: 'Vela', sku: null, idCategoriaProducto: 1, nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 10, stockActual: 5 }])),
        getProductoById: vi.fn(() => of({ idProducto: 8, codProducto: 'P8', nombre: 'Vela', sku: null, precioCompra: 5 })),
        create: vi.fn(() => of({ idCompra: 1, codCompra: 'CMP2026-000001', fechaCompra: '2026-08-25', total: 20, estadoCompra: 'REGISTRADA', rowVersion: 'A', mensaje: 'OK' }))
    };
    let store: CompraFormStore;
    beforeEach(() => { Object.values(apiMock).forEach(mock => mock.mockClear()); TestBed.configureTestingModule({ providers: [CompraFormStore, { provide: CompraApiService, useValue: apiMock }] }); store = TestBed.inject(CompraFormStore); });
    it('should load voucher types and search suppliers/products', () => { store.initialize(); expect(apiMock.getTiposComprobante).toHaveBeenCalledOnce(); store.searchProveedores('san'); expect(apiMock.searchProveedores).toHaveBeenCalledWith('san', 10); store.searchProductos('vela'); expect(apiMock.searchProductos).toHaveBeenCalledWith('vela', 10); });
    it('should add product using reference purchase price and calculate total', () => { const product = { idProducto: 8, codProducto: 'P8', nombre: 'Vela', sku: null, idCategoriaProducto: 1, nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 10, stockActual: 5 }; expect(store.addProduct(product)).toBe('ADDED'); expect(apiMock.getProductoById).toHaveBeenCalledWith(8); expect(store.items()[0].costoUnitario).toBe(5); store.updateQuantity(8, 3); store.updateCost(8, 6); expect(store.total()).toBe(18); expect(store.addProduct(product)).toBe('DUPLICATE'); });
    it('should register purchase', () => { const request = { idProveedor: 2, idTipoComprobanteCompra: 1, fechaCompra: '2026-08-25', serieComprobante: 'F001', numeroComprobante: '1', observaciones: null, items: [{ idProducto: 8, cantidad: 2, costoUnitario: 5 }] }; store.create(request); expect(apiMock.create).toHaveBeenCalledWith(request); expect(store.saveResult()?.codCompra).toBe('CMP2026-000001'); });
});
