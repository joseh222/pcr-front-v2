import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ProductoApiService } from '../producto-api.service';
import { ProductoFormStore } from './producto-form.store';

describe('ProductoFormStore', () => {
    const detail = { idProducto: 5, codProducto: 'P2026-00000005', nombre: 'Vela', rowVersion: 'AAAAAAAABQ=' } as any;
    const apiMock = {
        getCategorias: vi.fn(() => of([])), getMarcas: vi.fn(() => of([])), getById: vi.fn(() => of(detail)),
        create: vi.fn(() => of({ idProducto: 5, codProducto: 'P2026-00000005', rowVersion: 'A', mensaje: 'Producto registrado correctamente.' })),
        update: vi.fn(() => of({ idProducto: 5, codProducto: 'P2026-00000005', rowVersion: 'B', mensaje: 'Producto actualizado correctamente.' }))
    };
    let store: ProductoFormStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [ProductoFormStore, { provide: ProductoApiService, useValue: apiMock }] });
        store = TestBed.inject(ProductoFormStore);
    });

    it('should initialize create mode with catalogs', () => {
        store.initialize(null); expect(apiMock.getCategorias).toHaveBeenCalledOnce(); expect(apiMock.getMarcas).toHaveBeenCalledOnce(); expect(apiMock.getById).not.toHaveBeenCalled();
    });

    it('should initialize edit mode with detail', () => {
        store.initialize(5); expect(apiMock.getById).toHaveBeenCalledWith(5); expect(store.detail()?.codProducto).toBe('P2026-00000005');
    });

    it('should create and update a product', () => {
        const create = { idCategoriaProducto: 1, idMarcaProducto: null, nombre: 'Vela', sku: null, descripcion: null, precioCompra: 2, precioVenta: 5 };
        store.create(create); expect(apiMock.create).toHaveBeenCalledWith(create); expect(store.saveResult()?.idProducto).toBe(5);
        store.clearSaveResult(); store.update(5, { ...create, rowVersion: 'AAAAAAAABQ=' }); expect(apiMock.update).toHaveBeenCalledOnce();
    });
});
