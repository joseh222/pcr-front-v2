import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { VentaApiService } from '../venta-api.service';
import { VentaDetailStore } from './venta-detail.store';

const DETAIL = {
    idVenta: 15,
    codVenta: 'V2026-00015',
    detalles: []
} as any;

describe('VentaDetailStore', () => {
    const apiMock = {
        getById: vi.fn(() => of(DETAIL))
    };

    let store: VentaDetailStore;

    beforeEach(() => {
        apiMock.getById.mockClear();

        TestBed.configureTestingModule({
            providers: [
                VentaDetailStore,
                { provide: VentaApiService, useValue: apiMock }
            ]
        });

        store = TestBed.inject(VentaDetailStore);
    });

    it('should load a sale detail', () => {
        store.load(15);

        expect(apiMock.getById).toHaveBeenCalledWith(15);
        expect(store.detail()?.codVenta).toBe('V2026-00015');
        expect(store.loading()).toBe(false);
    });
});