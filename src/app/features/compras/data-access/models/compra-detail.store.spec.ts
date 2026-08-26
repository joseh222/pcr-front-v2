import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CompraApiService } from '../compra-api.service';
import { CompraDetailStore } from './compra-detail.store';

const DETAIL = { idCompra: 5, codCompra: 'CMP2026-000005', detalles: [] } as any;

describe('CompraDetailStore', () => {
    const apiMock = { getById: vi.fn(() => of(DETAIL)) };
    let store: CompraDetailStore;

    beforeEach(() => {
        apiMock.getById.mockClear();
        TestBed.configureTestingModule({ providers: [CompraDetailStore, { provide: CompraApiService, useValue: apiMock }] });
        store = TestBed.inject(CompraDetailStore);
    });

    it('should load purchase detail', () => {
        store.load(5);
        expect(apiMock.getById).toHaveBeenCalledWith(5);
        expect(store.detail()?.codCompra).toBe('CMP2026-000005');
        expect(store.loading()).toBe(false);
    });
});
