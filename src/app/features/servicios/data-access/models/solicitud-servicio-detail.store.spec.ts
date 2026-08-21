import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SolicitudServicioApiService } from '../solicitud-servicio-api.service';
import { SolicitudServicioDetailStore } from './solicitud-servicio-detail.store';

describe('SolicitudServicioDetailStore', () => {
    const apiMock = { getById: vi.fn(() => of({ idSolicitudServicio: 10, codSolicitudServicio: 'SS2026-00010' } as any)) };
    beforeEach(() => { apiMock.getById.mockClear(); TestBed.configureTestingModule({ providers: [SolicitudServicioDetailStore, { provide: SolicitudServicioApiService, useValue: apiMock }] }); });
    it('should load request detail', () => {
        const store = TestBed.inject(SolicitudServicioDetailStore); store.load(10);
        expect(apiMock.getById).toHaveBeenCalledWith(10); expect(store.detail()?.codSolicitudServicio).toBe('SS2026-00010');
    });
});
