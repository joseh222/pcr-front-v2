import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CompraCancellationService } from '../../data-access/compra-cancellation.service';
import { CompraDetailStore } from '../../data-access/models/compra-detail.store';
import { CompraDetailPage } from './compra-detail';

const DETAIL = {
    idCompra: 5, codCompra: 'CMP2026-000005', fechaCompra: '2026-08-25', razonSocialProveedor: 'Distribuidora San José SAC', tipoDocumentoProveedor: 'RUC', numeroDocumentoProveedor: '20123456789', nombreComercialProveedor: 'San José', nombreTipoComprobante: 'Factura', serieComprobante: 'F001', numeroComprobante: '000123', codigoEstadoCompra: 'REGISTRADA', nombreEstadoCompra: 'Registrada', moneda: 'PEN', total: 55, cantidadDetalles: 1, cantidadTotal: 10, observaciones: null, createdUtc: '2026-08-25T20:00:00Z', createdById: 9, puedeAnular: true, rowVersion: 'AAAAAAAABQ=', motivoAnulacion: null, anuladaUtc: null, anuladaById: null,
    detalles: [{ idCompraDetalle: 10, idProducto: 8, codigoProducto: 'P2026-000008', sku: 'VEL-001', descripcion: 'Vela blanca', cantidad: 10, costoUnitario: 5.5, subTotal: 55 }]
} as any;

describe('CompraDetailPage', () => {
    const detail = signal<any>(DETAIL);
    const storeMock = { detail: detail.asReadonly(), loading: signal(false).asReadonly(), error: signal<string | null>(null).asReadonly(), load: vi.fn() };
    const cancellationMock = { cancel: vi.fn(() => of({ idCompra: 5 })) };

    beforeEach(() => {
        storeMock.load.mockClear(); cancellationMock.cancel.mockClear(); detail.set(DETAIL);
        TestBed.configureTestingModule({ imports: [CompraDetailPage], providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '5' }) } } }, { provide: CompraCancellationService, useValue: cancellationMock }] });
        TestBed.overrideComponent(CompraDetailPage, { set: { providers: [{ provide: CompraDetailStore, useValue: storeMock }] } });
    });

    it('should load and render purchase detail', () => {
        const fixture = TestBed.createComponent(CompraDetailPage); fixture.detectChanges();
        expect(storeMock.load).toHaveBeenCalledWith(5); expect(fixture.nativeElement.textContent).toContain('CMP2026-000005'); expect(fixture.nativeElement.textContent).toContain('Distribuidora San José SAC'); expect(fixture.nativeElement.textContent).toContain('Vela blanca');
    });

    it('should cancel purchase and reload detail', () => {
        const fixture = TestBed.createComponent(CompraDetailPage); fixture.detectChanges(); storeMock.load.mockClear();
        fixture.componentInstance['cancel']();
        expect(cancellationMock.cancel).toHaveBeenCalledWith({ idCompra: 5, codCompra: 'CMP2026-000005', rowVersion: 'AAAAAAAABQ=' });
        expect(storeMock.load).toHaveBeenCalledWith(5);
    });
});
