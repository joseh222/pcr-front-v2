import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { vi } from 'vitest';

import { routes } from './app.routes';
import { ThemePreference } from './core/theme/theme.model';
import { ThemeService } from './core/theme/theme.service';
import { AppShell } from './layout/app-shell/app-shell';
import { NotFound } from './shared/pages/not-found/not-found';
import { AuthStore } from './features/auth/data-access/auth.store';
import { ChangePasswordPage } from './features/auth/pages/change-password/change-password';
import { DashboardPage } from './features/dashboard/pages/dashboard';
import { of } from 'rxjs';
import { MisaApiService } from './features/misas/data-access/misa-api.service';
import { PersonaApiService } from './features/personas/data-access/persona-api.service';
import { PersonaStatusService } from './features/personas/data-access/persona-status.service';
import { FeedbackService } from './core/feedback/feedback.service';
import { VentaApiService } from './features/ventas/data-access/venta-api.service';
import { VentaCancellationService } from './features/ventas/data-access/venta-cancellation.service';
import { ProductoApiService } from './features/productos/data-access/producto-api.service';
import { ProductoStatusService } from './features/productos/data-access/producto-status.service';
import { InventarioApiService } from './features/inventario/data-access/inventario-api.service';
import { ServicioApiService } from './features/servicios/data-access/servicio-api.service';
import { ServicioStatusService } from './features/servicios/data-access/servicio-status.service';
import { SolicitudServicioApiService } from './features/servicios/data-access/solicitud-servicio-api.service';
import { SolicitudServicioCancellationService } from './features/servicios/data-access/solicitud-servicio-cancellation.service';
import { ProveedorApiService } from './features/proveedores/data-access/proveedor-api.service';
import { ProveedorStatusService } from './features/proveedores/data-access/proveedor-status.service';
import { CompraApiService } from './features/compras/data-access/compra-api.service';

describe('Application routes', () => {
    const preference = signal<ThemePreference>('system');
    const resolvedTheme = signal<'light' | 'dark'>('light');
    const isAuthenticated = signal(true);
    const mustChangePassword = signal(false);

    const currentUser = signal({
        idUser: 1,
        username: 'ADMIN',
        displayName: 'Administrador PCR',
        email: 'admin@pcr.pe',
        roleCode: 'ADMIN',
        sessionId: 'session-1',
        mustChangePassword: false,
        expiresAtUnix: 9999999999
    });

    const roleCode = signal('ADMIN');
    const roleCodes = signal<readonly string[]>(['ADMIN']);
    const permissions = signal<readonly string[]>([]);
    const grantsAllPermissions = signal(true);

    const authStoreMock = {
        isAuthenticated: isAuthenticated.asReadonly(),
        mustChangePassword: mustChangePassword.asReadonly(),
        currentUser: currentUser.asReadonly(),
        roleCode: roleCode.asReadonly(),
        roleCodes: roleCodes.asReadonly(),
        permissions: permissions.asReadonly(),
        grantsAllPermissions: grantsAllPermissions.asReadonly(),
        hasPermission: (permission: string) => grantsAllPermissions() || permissions().includes(permission),
        hasAllPermissions: (required: readonly string[]) => grantsAllPermissions() || required.every(permission => permissions().includes(permission)),
        hasAnyPermission: (required: readonly string[]) => grantsAllPermissions() || required.some(permission => permissions().includes(permission)),
        logout: vi.fn()
    };
    const themeServiceMock = {
        preference: preference.asReadonly(),
        resolvedTheme: resolvedTheme.asReadonly(),
        setPreference: vi.fn()
    };
    const personaApiMock = {
        getTiposDocumento: vi.fn(() => of([
            { idTipoDocumento: 1, codigo: 'DNI', nombre: 'DNI', longitudMinima: 8, longitudMaxima: 8, soloNumeros: true, isActive: true }
        ])),
        getRoles: vi.fn(() => of([{ idRolPersona: 7, codigo: 'AGENTE_PASTORAL', nombre: 'Agente pastoral', descripcion: null, isActive: true }])),
        getList: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 20, totalRecords: 0, totalPages: 0 })),
        getById: vi.fn(() => of({
            idPersona: 5, codPersona: 'PER2026-000005', idTipoDocumento: 1, codigoTipoDocumento: 'DNI', nombreTipoDocumento: 'DNI',
            numeroDocumento: '12345678', nombreCompleto: 'JUAN PEREZ', fechaNacimiento: '1990-01-01', telefono: '999999999',
            email: 'juan@pcr.pe', direccion: 'Pueblo Nuevo', isActive: true, createdUtc: '2026-08-20T00:00:00Z', updatedUtc: null,
            roles: [{ idRolPersona: 7, codigo: 'AGENTE_PASTORAL', nombre: 'Agente pastoral', descripcion: null }], rowVersion: 'AQIDBAUGBwg='
        })),
        getByDocument: vi.fn(() => of(null)),
        search: vi.fn(() => of([])),
        create: vi.fn(() => of({ idPersona: 1, codPersona: 'PER-1', rowVersion: 'AQIDBAUGBwg=', mensaje: 'OK' })),
        update: vi.fn(() => of({ idPersona: 5, codPersona: 'PER2026-000005', rowVersion: 'AgMEBQYHCAk=', mensaje: 'OK' })),
        changeStatus: vi.fn(() => of({ idPersona: 5, isActive: false, rowVersion: 'AgMEBQYHCAk=', mensaje: 'OK' }))
    };

    const personaStatusMock = { change: vi.fn(() => of(false)) };

    const feedbackMock = {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn()
    };

    const ventaApiMock = {
        getMetodosPago: vi.fn(() => of([{ idMetodoPago: 1, codigo: 'EFECTIVO', nombre: 'Efectivo', isActive: true }])),
        getTiposComprobante: vi.fn(() => of([{ idTipoComprobante: 1, codigo: 'RECIBO', nombre: 'Recibo interno', serieDefault: 'R001', isActive: true }])),
        getSolicitudById: vi.fn(() => of(null)),
        searchProductos: vi.fn(() => of([])),
        getPersonaTiposDocumento: vi.fn(() => of([])),
        getPersonaByDocument: vi.fn(() => of(null)),
        searchPersonas: vi.fn(() => of([])),
        getPersonaById: vi.fn(() => of(null)),
        searchServiciosPendientes: vi.fn(() => of([])),
        create: vi.fn(() => of({})),

        getList: vi.fn(() =>
            of({
                pagina: 1,
                tamanoPagina: 20,
                totalRegistros: 0,
                totalPaginas: 0,
                items: []
            })
        ),

        getById: vi.fn(() => of({
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
        })),
    };

    const misaApiMock = {
        getModalidades: vi.fn(() => of([])),
        getTipos: vi.fn(() => of([])),
        getEstados: vi.fn(() => of([])),
        getSantos: vi.fn(() => of([])),
        getPersonaTiposDocumento: vi.fn(() => of([])),
        getPersonaByDocument: vi.fn(() => of(null)),
        searchPersonas: vi.fn(() => of([])),
        getList: vi.fn(() =>
            of({
                pagina: 1,
                tamanoPagina: 20,
                totalRegistros: 0,
                totalPaginas: 0,
                items: []
            })
        ),

        getById: vi.fn(() => of({
            idMisa: 15,
            codMisa: 'M2026-00015',
            modalidad: { idModalidad: 1, nombre: 'Personal' },
            tipo: { idTipo: 2, codigo: 'DIFUNTO', nombre: 'Difunto' },
            solicitante: null,
            estado: null,
            santo: null,
            intenciones: [],
            fecha: '2026-08-30T00:00:00',
            hora: '18:00:00',
            fechaHora: '2026-08-30T18:00:00',
            observaciones: null,
            motivo: null,
            ofrecen: null,
            celular: null,
            devotos: null,
            solicitudServicio: null,
            puedeEditar: true,
            puedeEliminar: true,
            puedeCobrar: false
        }))
    };

    const cancellationMock = {
        cancel: vi.fn(() => of(null))
    };
    const productoApiMock = {
        getCategorias: vi.fn(() => of([{ idCategoriaProducto: 1, codigo: 'VELAS', nombre: 'Velas', descripcion: null, isActive: true, rowVersion: 'A' }])),
        getMarcas: vi.fn(() => of([])),
        getList: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 20, totalRecords: 0, totalPages: 0 })),
        search: vi.fn(() => of([])),
        getById: vi.fn(() => of({ idProducto: 5, codProducto: 'P2026-00000005', idCategoriaProducto: 1, codigoCategoria: 'VELAS', nombreCategoria: 'Velas', idMarcaProducto: null, codigoMarca: null, nombreMarca: null, nombre: 'Vela', sku: 'VEL-001', descripcion: null, precioCompra: 2, precioVenta: 5, stockActual: 10, isActive: true, createdUtc: '2026-08-20T00:00:00Z', updatedUtc: null, createdById: 1, updatedById: null, rowVersion: 'A', stockRowVersion: 'B' })),
        create: vi.fn(() => of({ idProducto: 5, codProducto: 'P2026-00000005', rowVersion: 'A', mensaje: 'OK' })),
        update: vi.fn(() => of({ idProducto: 5, codProducto: 'P2026-00000005', rowVersion: 'B', mensaje: 'OK' })),
        changeStatus: vi.fn(() => of({ idProducto: 5, isActive: false, rowVersion: 'B', mensaje: 'OK' }))
    };

    const productoStatusMock = { change: vi.fn(() => of(null)) };
    const inventarioApiMock = {
        getTiposMovimientoHistorial: vi.fn(() => of([])),
        getProductos: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 100, totalRecords: 0, totalPages: 0 })),
        getMovimientos: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 20, totalRecords: 0, totalPages: 0 })),
        getTiposMovimiento: vi.fn(() => of([
            { idTipoMovimiento: 1, codigo: 'STOCK_INICIAL', nombre: 'Stock inicial', naturaleza: 'E', permiteRegistroManual: true },
            { idTipoMovimiento: 2, codigo: 'AJUSTE_ENTRADA', nombre: 'Ajuste de entrada', naturaleza: 'E', permiteRegistroManual: true }
        ])),
        getByProducto: vi.fn(() => of({
            idProducto: 5, codProducto: 'P2026-00000005', nombre: 'Vela', sku: 'VEL-001', idCategoriaProducto: 1,
            nombreCategoria: 'Velas', idMarcaProducto: null, nombreMarca: null, precioCompra: 2, precioVenta: 5,
            isActive: true, stockActual: 10, updatedUtc: null, updatedById: null, stockRowVersion: 'B', fechaUltimoMovimiento: '2026-08-20T12:00:00Z'
        })),
        createMovimiento: vi.fn(() => of({ idMovimiento: 10, idProducto: 5, stockAnterior: 10, stockNuevo: 15, mensaje: 'Movimiento registrado correctamente.' }))
    };

    const servicioApiMock = {
        getCategorias: vi.fn(() => of([{ idCategoriaServicio: 1, codigo: 'LITURGICO', nombre: 'Litúrgicos', descripcion: null, isActive: true, rowVersion: 'A' }])),
        getList: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 20, totalRecords: 0, totalPages: 0 })),
        getById: vi.fn(() => of({ idServicio: 5, codigo: 'CONSTANCIA', idCategoriaServicio: 1, codigoCategoria: 'LITURGICO', nombreCategoria: 'Litúrgicos', categoriaIsActive: true, nombre: 'Constancia', descripcion: null, modoPrecio: 'FIJO', precioBase: 15, isActive: true, createdUtc: '2026-08-20T00:00:00Z', updatedUtc: null, createdById: 1, updatedById: null, rowVersion: 'A' })),
        create: vi.fn(() => of({ idServicio: 5, codigo: 'CONSTANCIA', rowVersion: 'A', mensaje: 'OK' })),
        update: vi.fn(() => of({ idServicio: 5, codigo: 'CONSTANCIA', rowVersion: 'B', mensaje: 'OK' })),
        changeStatus: vi.fn(() => of({ idServicio: 5, isActive: false, rowVersion: 'B', mensaje: 'OK' })),
        search: vi.fn(() => of([]))
    };
    const servicioStatusMock = { change: vi.fn(() => of(null)) };

    const proveedorApiMock = {
        getTiposDocumento: vi.fn(() => of([{ idTipoDocumento: 3, codigo: 'RUC', nombre: 'RUC', longitudMinima: 11, longitudMaxima: 11, soloNumeros: true, isActive: true }])),
        getList: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 20, totalRecords: 0, totalPages: 0 })),
        getById: vi.fn(() => of({ idProveedor: 5, codProveedor: 'PRV2026-000005', idTipoDocumento: 3, codigoTipoDocumento: 'RUC', nombreTipoDocumento: 'RUC', numeroDocumento: '20123456789', razonSocial: 'Proveedor SAC', nombreComercial: null, telefono: null, email: null, direccion: null, observaciones: null, isActive: true, createdUtc: '2026-08-20T00:00:00Z', updatedUtc: null, createdById: 1, updatedById: null, rowVersion: 'A' })),
        create: vi.fn(() => of({ idProveedor: 5, codProveedor: 'PRV2026-000005', rowVersion: 'A', mensaje: 'OK' })),
        update: vi.fn(() => of({ idProveedor: 5, codProveedor: 'PRV2026-000005', rowVersion: 'B', mensaje: 'OK' })),
        changeStatus: vi.fn(() => of({ idProveedor: 5, isActive: false, rowVersion: 'B', mensaje: 'OK' })),
        search: vi.fn(() => of([]))
    };
    const proveedorStatusMock = { change: vi.fn(() => of(null)) };
    const compraApiMock = {
        getEstados: vi.fn(() => of([{ idEstadoCompra: 1, codigo: 'REGISTRADA', nombre: 'Registrada', isActive: true }])),
        getTiposComprobante: vi.fn(() => of([{ idTipoComprobanteCompra: 1, codigo: 'FACTURA', nombre: 'Factura', requiereSerie: true, requiereNumero: true, isActive: true }])),
        getList: vi.fn(() => of({ pageNumber: 1, pageSize: 20, totalRows: 0, totalPages: 0, items: [] })),
        getById: vi.fn(() => of({
            idCompra: 5, codCompra: 'CMP2026-000005', fechaCompra: '2026-08-25', idProveedor: 2, tipoDocumentoProveedor: 'RUC', numeroDocumentoProveedor: '20123456789', razonSocialProveedor: 'Distribuidora San José SAC', nombreComercialProveedor: 'San José', idTipoComprobanteCompra: 1, codigoTipoComprobante: 'FACTURA', nombreTipoComprobante: 'Factura', serieComprobante: 'F001', numeroComprobante: '000123', idEstadoCompra: 1, codigoEstadoCompra: 'REGISTRADA', nombreEstadoCompra: 'Registrada', moneda: 'PEN', total: 55, cantidadDetalles: 1, cantidadTotal: 10, observaciones: null, motivoAnulacion: null, anuladaUtc: null, anuladaById: null, createdUtc: '2026-08-25T20:00:00Z', createdById: 9, puedeAnular: true, rowVersion: 'A', detalles: [{ idCompraDetalle: 10, idProducto: 8, codigoProducto: 'P2026-000008', sku: 'VEL-001', descripcion: 'Vela blanca', cantidad: 10, costoUnitario: 5.5, subTotal: 55 }]
        })),
        create: vi.fn(() => of({ idCompra: 1, codCompra: 'CMP2026-000001', fechaCompra: '2026-08-25', total: 10, estadoCompra: 'REGISTRADA', rowVersion: 'A', mensaje: 'OK' }))
    };

    const solicitudServicioApiMock = {
        getEstados: vi.fn(() => of([{ idEstadoSolicitudServicio: 1, codigo: 'ACTIVA', nombre: 'Activa' }])),
        getEstadosPago: vi.fn(() => of([{ idEstadoPagoSolicitudServicio: 1, codigo: 'PENDIENTE', nombre: 'Pendiente' }])),
        getList: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 20, totalRecords: 0, totalPages: 0 })),
        getServicios: vi.fn(() => of({ items: [], pageNumber: 1, pageSize: 100, totalRecords: 0, totalPages: 0 })),
        searchServicios: vi.fn(() => of([])),
        getServicioById: vi.fn(() => of({ idServicio: 5, codigo: 'CONSTANCIA', nombre: 'Constancia', nombreCategoria: 'Litúrgicos', modoPrecio: 'FIJO', precioBase: 15 })),
        getPersonaTiposDocumento: vi.fn(() => of([])),
        getPersonaByDocument: vi.fn(() => of(null)),
        searchPersonas: vi.fn(() => of([])),
        search: vi.fn(() => of([])),
        getById: vi.fn(() => of({ idSolicitudServicio: 10, codSolicitudServicio: 'SS2026-00010', idServicio: 5, codigoServicio: 'CONSTANCIA', nombreServicio: 'Constancia', modoPrecio: 'FIJO', idPersona: 1, numeroDocumento: '12345678', nombreCompleto: 'JOSE', telefono: null, requierePago: true, importe: 15, motivoNoPago: null, estadoSolicitud: 'ACTIVA', nombreEstadoSolicitud: 'Activa', estadoPago: 'PENDIENTE', nombreEstadoPago: 'Pendiente', observaciones: null, createdUtc: '2026-08-20T12:00:00Z', updatedUtc: null, createdById: 1, updatedById: null, motivoAnulacion: null, anuladaUtc: null, anuladaById: null, rowVersion: 'A' })),
        create: vi.fn(() => of({ idSolicitudServicio: 10, codSolicitudServicio: 'SS2026-00010', codigoServicio: 'CONSTANCIA', nombreServicio: 'Constancia', requierePago: true, importe: 15, motivoNoPago: null, estadoSolicitud: 'ACTIVA', estadoPago: 'PENDIENTE', rowVersion: 'A', mensaje: 'OK' })),
        update: vi.fn(() => of({ idSolicitudServicio: 10, codSolicitudServicio: 'SS2026-00010', requierePago: true, importe: 15, motivoNoPago: null, estadoPago: 'PENDIENTE', rowVersion: 'B', mensaje: 'OK' })),
        cancel: vi.fn(() => of({ idSolicitudServicio: 10, codSolicitudServicio: 'SS2026-00010', estadoSolicitud: 'ANULADA', rowVersion: 'B', mensaje: 'OK' }))
    };
    const solicitudCancellationMock = { cancel: vi.fn(() => of(null)) };


    beforeEach(() => {
        misaApiMock.getModalidades.mockClear();
        misaApiMock.getTipos.mockClear();
        misaApiMock.getEstados.mockClear();
        misaApiMock.getList.mockClear();
        misaApiMock.getById.mockClear();
        misaApiMock.getSantos.mockClear();
        isAuthenticated.set(true);
        roleCodes.set(['ADMIN']);
        permissions.set([]);
        grantsAllPermissions.set(true);
        preference.set('system');
        resolvedTheme.set('light');
        mustChangePassword.set(false);
        themeServiceMock.setPreference.mockClear();
        Object.values(personaApiMock).forEach(mock => mock.mockClear());
        personaStatusMock.change.mockClear();
        Object.values(ventaApiMock).forEach(mock => mock.mockClear());
        Object.values(productoApiMock).forEach(mock => mock.mockClear());
        productoStatusMock.change.mockClear();
        Object.values(inventarioApiMock).forEach(mock => mock.mockClear());
        Object.values(servicioApiMock).forEach(mock => mock.mockClear());
        servicioStatusMock.change.mockClear();
        Object.values(proveedorApiMock).forEach(mock => mock.mockClear());
        proveedorStatusMock.change.mockClear();
        Object.values(compraApiMock).forEach(mock => mock.mockClear());
        Object.values(solicitudServicioApiMock).forEach(mock => mock.mockClear());
        solicitudCancellationMock.cancel.mockClear();
        feedbackMock.success.mockClear();
        feedbackMock.error.mockClear();
        feedbackMock.warning.mockClear();
        feedbackMock.info.mockClear();

        TestBed.configureTestingModule({
            providers: [
                provideRouter(routes),
                {
                    provide: ThemeService,
                    useValue: themeServiceMock
                },
                { provide: AuthStore, useValue: authStoreMock },
                { provide: MisaApiService, useValue: misaApiMock },
                { provide: PersonaApiService, useValue: personaApiMock },
                { provide: PersonaStatusService, useValue: personaStatusMock },
                { provide: VentaApiService, useValue: ventaApiMock },
                { provide: FeedbackService, useValue: feedbackMock },
                { provide: VentaCancellationService, useValue: cancellationMock },
                { provide: ProductoApiService, useValue: productoApiMock },
                { provide: ProductoStatusService, useValue: productoStatusMock },
                { provide: InventarioApiService, useValue: inventarioApiMock },
                { provide: ServicioApiService, useValue: servicioApiMock },
                { provide: ServicioStatusService, useValue: servicioStatusMock },
                { provide: ProveedorApiService, useValue: proveedorApiMock },
                { provide: ProveedorStatusService, useValue: proveedorStatusMock },
                { provide: CompraApiService, useValue: compraApiMock },
                { provide: SolicitudServicioApiService, useValue: solicitudServicioApiMock },
                { provide: SolicitudServicioCancellationService, useValue: solicitudCancellationMock }
            ]
        });
    });

    it('should redirect the root route to dashboard', async () => {
        const harness = await RouterTestingHarness.create();
        const router = TestBed.inject(Router);

        await harness.navigateByUrl('/', AppShell);

        expect(router.url).toBe('/dashboard');
        expect(harness.routeNativeElement?.textContent).toContain('Dashboard');
        expect(harness.routeNativeElement?.textContent).toContain(
            'Bienvenido al Sistema de Gestión Parroquial.'
        );
    });
    it('should load the not found page for an unknown route', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/ruta-que-no-existe', NotFound);

        expect(harness.routeNativeElement?.textContent).toContain('Página no encontrada');
        expect(harness.routeNativeElement?.textContent).toContain('ERROR 404');
    });

    it('should redirect to password change when it is required', async () => {
        mustChangePassword.set(true);

        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/', ChangePasswordPage);

        expect(harness.routeNativeElement?.textContent).toContain('Cambiar contraseña');
    });

    it('should load persons inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/personas', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Personas');
        expect(harness.routeNativeElement?.textContent).toContain('registro central de personas');
    });

    it('should load new and edit person pages inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/personas/nueva', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Nueva persona');

        await harness.navigateByUrl('/personas/5/editar', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Editar persona');

        const nameInput = harness.routeNativeElement?.querySelector(
            'input[formControlName="nombreCompleto"]'
        ) as HTMLInputElement;

        expect(nameInput.value).toBe('JUAN PEREZ');
    });

    it('should load person detail inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/personas/5', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Detalle de persona');
        expect(harness.routeNativeElement?.textContent).toContain('JUAN PEREZ');
        expect(harness.routeNativeElement?.textContent).toContain('Agente pastoral');
    });

    it('should load misas inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();

        await harness.navigateByUrl('/misas', AppShell);

        expect(harness.routeNativeElement?.textContent).toContain('Misas');
        expect(harness.routeNativeElement?.textContent).toContain(
            'Consulta y administra las misas e intenciones parroquiales.'
        );
    });

    it('should load purchases inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/compras', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Compras');
        expect(harness.routeNativeElement?.textContent).toContain('Consulta las compras registradas');
    });

    it('should load purchase detail inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/compras/5', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('CMP2026-000005');
        expect(harness.routeNativeElement?.textContent).toContain('Distribuidora San José SAC');
        expect(harness.routeNativeElement?.textContent).toContain('Vela blanca');
    });

    it('should load the new purchase page inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/compras/nueva', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Nueva compra');
        expect(harness.routeNativeElement?.textContent).toContain('Detalle de compra');
    });

    it('should load the new sale page inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/ventas/nueva', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Nueva venta');
        expect(harness.routeNativeElement?.textContent).toContain('Detalle de venta');
    });

    it('should load the new misa page inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/misas/nueva', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Nueva misa');
        expect(harness.routeNativeElement?.textContent).toContain('Registra una nueva misa e intenciones parroquiales.');
    });

    it('should load the edit misa page inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/misas/15/editar', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Editar misa');
        expect(harness.routeNativeElement?.textContent).toContain('Misa #15');
    });

    it('should load service requests inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/servicios', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Servicios');
        expect(harness.routeNativeElement?.textContent).toContain('solicitudes de servicio');
    });

    it('should load service request detail inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/servicios/10', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('SS2026-00010');
        expect(harness.routeNativeElement?.textContent).toContain('Constancia');
    });

    it('should load new and edit service request pages inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/servicios/nueva', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Nueva solicitud');
        await harness.navigateByUrl('/servicios/10/editar', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Editar solicitud');
        expect(harness.routeNativeElement?.textContent).toContain('Constancia');
    });

    it('should load sales inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();

        await harness.navigateByUrl('/ventas', AppShell);

        expect(harness.routeNativeElement?.textContent).toContain('Ventas');
        expect(harness.routeNativeElement?.textContent)
            .toContain('Consulta las ventas registradas');
    });

    it('should load sale detail inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();

        await harness.navigateByUrl('/ventas/15', AppShell);

        expect(harness.routeNativeElement?.textContent).toContain('V2026-00015');
        expect(harness.routeNativeElement?.textContent).toContain('SS2026-00025');
    });


    it('should load products inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/productos', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Productos');
        expect(harness.routeNativeElement?.textContent).toContain('Administra el catálogo comercial');
    });

    it('should load new and edit product pages inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();

        await harness.navigateByUrl('/productos/nuevo', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Nuevo producto');

        await harness.navigateByUrl('/productos/5/editar', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Editar producto');
    });

    it('should load product detail inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/productos/5', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('P2026-00000005');
        expect(harness.routeNativeElement?.textContent).toContain('Stock actual');
    });


    it('should load global inventory movements inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/inventario/movimientos', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Movimientos');
        expect(harness.routeNativeElement?.textContent).toContain('trazabilidad completa');
    });

    it('should load inventory movement form inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/productos/5/movimiento', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Registrar movimiento');
        expect(harness.routeNativeElement?.textContent).toContain('Stock actual');
    });

    it('should load service catalog inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/catalogos/servicios', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Servicios');
        expect(harness.routeNativeElement?.textContent).toContain('Administra los servicios que ofrece la parroquia');
    });

    it('should load new and edit service catalog pages inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/catalogos/servicios/nuevo', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Nuevo servicio');
        await harness.navigateByUrl('/catalogos/servicios/5/editar', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Editar servicio');
    });

    it('should load supplier catalog inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/catalogos/proveedores', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Proveedores');
        expect(harness.routeNativeElement?.textContent).toContain('Administra las personas y empresas');
    });

    it('should load new and edit supplier pages inside the application shell', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/catalogos/proveedores/nuevo', AppShell);
        expect(harness.routeNativeElement?.textContent).toContain('Nuevo proveedor');
        await harness.navigateByUrl('/catalogos/proveedores/5/editar', AppShell);

        expect(harness.routeNativeElement?.textContent).toContain('Editar proveedor');

        const razonSocialInput = harness.routeNativeElement?.querySelector(
            'input[formControlName="razonSocial"]'
        ) as HTMLInputElement;

        expect(razonSocialInput.value).toBe('Proveedor SAC');
    });
});