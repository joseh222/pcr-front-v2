import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { VentaCancellationService } from '../../data-access/venta-cancellation.service';
import { VentaApiService } from '../../data-access/venta-api.service';
import { VentaDetailStore } from '../../data-access/models/venta-detail.store';
import { VentaDetailPage } from './venta-detail';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { MatDialog } from '@angular/material/dialog';

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

const authStoreMock = { hasPermission: vi.fn(() => true) };
const dialogMock = { open: vi.fn(() => ({ afterClosed: () => of(true) })) };
const apiMock = {
    getTicket: vi.fn(() => of(new Blob(['pdf'], { type: 'application/pdf' }))),
    getDocuments: vi.fn(() => of({ idVenta: 15, codVenta: 'V2026-00015', totalDocumentos: 2, tieneDocumentosAdicionales: true, documentos: [
        { tipo: 'VENTA_TICKET', titulo: 'Ticket de venta', orden: 1, codigoReferencia: 'R001-000015', cantidadSolicitudesImpresion: 0, cantidadImpresionesConfirmadas: 0, ultimaSolicitudUtc: null, estadoUltimoTrabajo: null, intentosUltimoTrabajo: null, maxIntentosUltimoTrabajo: null, ultimoErrorTrabajo: null, ultimoTrabajoUtc: null, misas: [] },
        { tipo: 'MISA_REGISTRO', titulo: 'Registro de Misas (2)', orden: 2, codigoReferencia: '2 misas', cantidadSolicitudesImpresion: 1, cantidadImpresionesConfirmadas: 0, ultimaSolicitudUtc: null, estadoUltimoTrabajo: 'PENDIENTE', intentosUltimoTrabajo: 1, maxIntentosUltimoTrabajo: 3, ultimoErrorTrabajo: null, ultimoTrabajoUtc: '2026-08-31T12:00:00Z', misas: [{ idMisa: 1, codMisa: 'M1', modalidad: 'PERSONAL', tipo: 'DIFUNTO', intenciones: [{ idIntencion: 10, nombre: 'JUAN', observacion: null }] }] }
    ] })),
    getDocumentsPdf: vi.fn(() => of(new Blob(['pdfs'], { type: 'application/pdf' }))),
    getMisasTicket: vi.fn(() => of(new Blob(['misas'], { type: 'application/pdf' }))),
    requestPrint: vi.fn(() => of({ tipoDocumento: 'MISA_REGISTRO', numeroSolicitud: 2, esReimpresion: true, fechaUtc: '2026-08-28T10:00:00Z', mensaje: 'Reimpresión solicitada.' })),
    getPrintMode: vi.fn(() => of({ modo: 'MANUAL', isActive: true })),
    printDocument: vi.fn(() => of({ tipoDocumento: 'MISA_REGISTRO', numeroSolicitud: 2, idTrabajo: 50, exitosa: true, estado: 'PENDIENTE', impresora: '80mm Series Printer', mensaje: 'Documento enviado.' }))
};

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
        Object.values(apiMock).forEach(mock => mock.mockClear());
        detail.set(DETAIL);

        TestBed.configureTestingModule({
            imports: [VentaDetailPage],
            providers: [{ provide: AuthStore, useValue: authStoreMock },
                { provide: VentaApiService, useValue: apiMock },
                { provide: MatDialog, useValue: dialogMock }, 
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
        expect(apiMock.getDocuments).toHaveBeenCalledWith(15);
        expect(fixture.nativeElement.textContent).toContain('Documentos generados');
    });

    it('should request the ticket', () => {
        const popup = { location: { href: '' }, close: vi.fn() } as any;
        vi.spyOn(window, 'open').mockReturnValue(popup);
        Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:ticket') });
        Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
        const fixture = TestBed.createComponent(VentaDetailPage);
        fixture.detectChanges();
        fixture.componentInstance['openTicket']();
        expect(apiMock.getTicket).toHaveBeenCalledWith(15);
        expect(popup.location.href).toBe('blob:ticket');
        vi.restoreAllMocks();
    });

    it('should request the complete document package', () => {
        const popup = { location: { href: '' }, close: vi.fn() } as any;
        vi.spyOn(window, 'open').mockReturnValue(popup);
        Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:documents') });
        Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });
        const fixture = TestBed.createComponent(VentaDetailPage); fixture.detectChanges();
        fixture.componentInstance['openDocuments']();
        expect(apiMock.getDocumentsPdf).toHaveBeenCalledWith(15);
        expect(popup.location.href).toBe('blob:documents');
        vi.restoreAllMocks();
    });

    it('should reload after cancellation', () => {
        const fixture = TestBed.createComponent(VentaDetailPage);

        fixture.detectChanges();
        storeMock.load.mockClear();

        fixture.componentInstance['cancel']();

        expect(cancellationMock.cancel).toHaveBeenCalledWith(DETAIL);
        expect(storeMock.load).toHaveBeenCalledWith(15);
    });


    it('should register print request before opening document', () => {
        const popup = { location: { href: '' }, close: vi.fn() } as any;
        vi.spyOn(window, 'open').mockReturnValue(popup);
        Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:print') });
        const fixture = TestBed.createComponent(VentaDetailPage); fixture.detectChanges();
        const doc = fixture.componentInstance['documents']()!.documentos[1];
        fixture.componentInstance['printDocument'](doc);
        expect(apiMock.requestPrint).toHaveBeenCalledWith(15, 'MISA_REGISTRO');
        expect(apiMock.getMisasTicket).toHaveBeenCalledWith(15);
        vi.restoreAllMocks();
    });
    it('should send directly to printer in automatic mode', () => {
        apiMock.getPrintMode.mockReturnValueOnce(of({ modo: 'AUTOMATICO', isActive: true }));
        const fixture = TestBed.createComponent(VentaDetailPage); fixture.detectChanges();
        const doc = fixture.componentInstance['documents']()!.documentos[0];
        fixture.componentInstance['printDocument'](doc);
        expect(apiMock.printDocument).toHaveBeenCalledWith(15, 'VENTA_TICKET');
    });

});
