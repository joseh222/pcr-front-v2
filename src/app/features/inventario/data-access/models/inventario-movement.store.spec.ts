import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { InventarioApiService } from '../inventario-api.service';
import { InventarioMovementStore } from './inventario-movement.store';

describe('InventarioMovementStore', () => {
    const inventory = { idProducto: 5, codProducto: 'P2026-00000005', nombre: 'Vela', stockActual: 10 } as any;
    const types = [{ idTipoMovimiento: 2, codigo: 'AJUSTE_ENTRADA', nombre: 'Ajuste de entrada', naturaleza: 'E', permiteRegistroManual: true }] as any;
    const apiMock = {
        getTiposMovimiento: vi.fn(() => of(types)), getByProducto: vi.fn(() => of(inventory)),
        createMovimiento: vi.fn(() => of({ idMovimiento: 10, idProducto: 5, stockAnterior: 10, stockNuevo: 15, mensaje: 'Movimiento registrado correctamente.' } as any))
    };
    let store: InventarioMovementStore;

    beforeEach(() => {
        Object.values(apiMock).forEach(mock => mock.mockClear());
        TestBed.configureTestingModule({ providers: [InventarioMovementStore, { provide: InventarioApiService, useValue: apiMock }] });
        store = TestBed.inject(InventarioMovementStore);
    });

    it('should initialize movement data', () => {
        store.initialize(5);
        expect(apiMock.getTiposMovimiento).toHaveBeenCalledOnce();
        expect(apiMock.getByProducto).toHaveBeenCalledWith(5);
        expect(store.inventory()?.stockActual).toBe(10);
        expect(store.tipos().length).toBe(1);
    });

    it('should create a movement', () => {
        const request = { idTipoMovimiento: 2, cantidad: 5, costoUnitario: 2.5, motivo: 'Reposición' };
        store.create(5, request);
        expect(apiMock.createMovimiento).toHaveBeenCalledWith(5, request);
        expect(store.saveResult()?.stockNuevo).toBe(15);
    });
});
