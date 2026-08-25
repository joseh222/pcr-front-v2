import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProductoApiService } from '../../../productos/data-access/producto-api.service';
import { ProveedorApiService } from '../../../proveedores/data-access/proveedor-api.service';
import { CompraApiService } from '../compra-api.service';
import { CompraFormStore } from './compra-form.store';

describe('CompraFormStore', () => {
    const compraApiMock = {
        getTiposComprobante: vi.fn(() => of([{ idTipoComprobanteCompra: 1, codigo: 'FACTURA', nombre: 'Factura', requiereSerie: true, requiereNumero: true, isActive: true }])),
        create: vi.fn(() => of({ idCompra: 1, codCompra: 'CMP2026-000001', fechaCompra: '2026-08-25', total: 20, estadoCompra: 'REGISTRADA', rowVersion: 'A', mensaje: 'OK' }))
    };
    const proveedorApiMock = { search: vi.fn(() => of([{ idProveedor: 2, codProveedor: 'PRV2', razonSocial: 'Proveedor', isActive: true }])) };
    const productoApiMock = {
        search: vi.fn(() => of([{ idProducto: 8, codProducto: 'P8', nombre: 'Vela', sku: null, idCategoriaProducto: 1, nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 10, stockActual: 5 }])),
        getById: vi.fn(() => of({ idProducto: 8, codProducto: 'P8', nombre: 'Vela', sku: null, precioCompra: 5 }))
    };
    let store: CompraFormStore;

    beforeEach(() => {
        Object.values(compraApiMock).forEach(mock => mock.mockClear()); Object.values(proveedorApiMock).forEach(mock => mock.mockClear()); Object.values(productoApiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [CompraFormStore, { provide: CompraApiService, useValue: compraApiMock }, { provide: ProveedorApiService, useValue: proveedorApiMock }, { provide: ProductoApiService, useValue: productoApiMock }] });
        store = TestBed.inject(CompraFormStore);
    });

    it('should load voucher types and search suppliers/products', () => {
        store.initialize(); expect(compraApiMock.getTiposComprobante).toHaveBeenCalledOnce(); expect(store.tiposComprobante().length).toBe(1);
        store.searchProveedores('san'); expect(proveedorApiMock.search).toHaveBeenCalledWith('san', 10); expect(store.proveedorResults().length).toBe(1);
        store.searchProductos('vela'); expect(productoApiMock.search).toHaveBeenCalledWith('vela', 10); expect(store.productoResults().length).toBe(1);
    });

    it('should add product using reference purchase price and calculate total', () => {
        const product = { idProducto: 8, codProducto: 'P8', nombre: 'Vela', sku: null, idCategoriaProducto: 1, nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioVenta: 10, stockActual: 5 };
        expect(store.addProduct(product)).toBe('ADDED'); expect(productoApiMock.getById).toHaveBeenCalledWith(8); expect(store.items()[0].costoUnitario).toBe(5);
        store.updateQuantity(8, 3); store.updateCost(8, 6); expect(store.total()).toBe(18);
        expect(store.addProduct(product)).toBe('DUPLICATE');
    });

    it('should register purchase', () => {
        const request = { idProveedor: 2, idTipoComprobanteCompra: 1, fechaCompra: '2026-08-25', serieComprobante: 'F001', numeroComprobante: '1', observaciones: null, items: [{ idProducto: 8, cantidad: 2, costoUnitario: 5 }] };
        store.create(request); expect(compraApiMock.create).toHaveBeenCalledWith(request); expect(store.saveResult()?.codCompra).toBe('CMP2026-000001');
    });
});
