import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { VentaCancellationService } from '../../data-access/venta-cancellation.service';
import { VentaDetailStore } from '../../data-access/models/venta-detail.store';
import { VentaDetailPage } from './venta-detail';

const DETAIL = {
    idVenta: 15,
    codVenta: 'V2026-00015',
    fechaVentaUtc: '2026-08-20T15:00:00Z',
    nombreEstadoVenta: 'Emitida',
    codigoEstadoVenta: 'EMITIDA',
    numeroComprobante: 'R001-000015',
    nombreCliente: 'JOSE',
    tipoDocumentoCliente: 'DNI',
    numeroDocumentoCliente: '12345678',
    telefonoCliente: null,
    nombreTipoComprobante: 'Recibo interno',
    nombreMetodoPago: 'Efectivo',
    cantidadDetalles: 1,
    subTotal: 30,
    impuesto: 0,
    total: 30,
    observaciones: null,
    puedeAnular: true,
    rowVersion: 'AAAAAAAABQ=',
    nombreRazonAnulacion: null,
    anuladaUtc: null,
    motivoAnulacion: null,
    detalles: [{
        idVentaDetalle: 1,
        tipoItem: 'SERVICIO',
        idProducto: null,
        idSolicitudServicio: 25,
        codigo: 'MISA',
        referencia: 'SS2026-00025',
        descripcion: 'Misa',
        cantidad: 1,
        precioUnitario: 30,
        subTotal: 30
    }]
} as any;

describe('VentaDetailPage', () => {
    const detail = signal<any>(DETAIL);

    const storeMock = {
        detail: detail.asReadonly(),
        loading: signal(false).asReadonly(),
        error: signal<string | null>(null).asReadonly(),
        load: vi.fn()
    };

    const cancellationMock = {
        cancel: vi.fn(() => of({ idVenta: 15 }))
    };

    beforeEach(() => {
        storeMock.load.mockClear();
        cancellationMock.cancel.mockClear();
        detail.set(DETAIL);

        TestBed.configureTestingModule({
            imports: [VentaDetailPage],
            providers: [
                provideRouter([]),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: convertToParamMap({ id: '15' })
                        }
                    }
                },
                {
                    provide: VentaCancellationService,
                    useValue: cancellationMock
                }
            ]
        });

        TestBed.overrideComponent(VentaDetailPage, {
            set: {
                providers: [
                    { provide: VentaDetailStore, useValue: storeMock }
                ]
            }
        });
    });

    it('should load and render the sale', () => {
        const fixture = TestBed.createComponent(VentaDetailPage);

        fixture.detectChanges();

        expect(storeMock.load).toHaveBeenCalledWith(15);
        expect(fixture.nativeElement.textContent).toContain('V2026-00015');
        expect(fixture.nativeElement.textContent).toContain('SS2026-00025');
    });

    it('should reload after cancellation', () => {
        const fixture = TestBed.createComponent(VentaDetailPage);

        fixture.detectChanges();
        storeMock.load.mockClear();

        fixture.componentInstance['cancel']();

        expect(cancellationMock.cancel).toHaveBeenCalledWith(DETAIL);
        expect(storeMock.load).toHaveBeenCalledWith(15);
    });
});