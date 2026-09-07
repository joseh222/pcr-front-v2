import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { ConfiguracionApiService } from './configuracion-api.service';

describe('ConfiguracionApiService', () => {
    let service: ConfiguracionApiService; let http: HttpTestingController; const apiBaseUrl = 'https://localhost:7002/api';
    beforeEach(() => { TestBed.configureTestingModule({ providers: [ConfiguracionApiService, provideHttpClient(), provideHttpClientTesting(), { provide: RuntimeConfigService, useValue: { config: { apiBaseUrl } } }] }); service = TestBed.inject(ConfiguracionApiService); http = TestBed.inject(HttpTestingController); });
    afterEach(() => http.verify());
    it('should get and update print configuration', () => {
        service.getImpresion().subscribe(); let req = http.expectOne(`${apiBaseUrl}/General/configuracion/impresion`); expect(req.request.method).toBe('GET'); req.flush({});
        const payload = { modo: 'MANUAL' as const, tipoConexion: 'RED' as const, nombreImpresoraWindows: '80mm Series Printer', direccionIp: '192.168.1.114', puerto: 9100, anchoPapelMm: 80, imprimirTicketVenta: true, imprimirDocumentosAsociados: true, cortarEntreDocumentos: true, isActive: true, rowVersion: 'AAAA' };
        service.updateImpresion(payload).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/impresion`); expect(req.request.method).toBe('PUT'); expect(req.request.body).toEqual(payload); req.flush({});
    });
    it('should get and update sacramental text configuration', () => {
        service.getSacramental().subscribe(); let req = http.expectOne(`${apiBaseUrl}/General/configuracion/sacramental`); expect(req.request.method).toBe('GET'); req.flush({ forzarMayusculas: true });
        const payload = { forzarMayusculas: false, rowVersion: 'BBBB' }; service.updateSacramental(payload).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/sacramental`); expect(req.request.method).toBe('PUT'); expect(req.request.body).toEqual(payload); req.flush({ forzarMayusculas: false });
    });
    it('should expose parish maintenance endpoints', () => {
        service.getParroquia().subscribe(); let req = http.expectOne(`${apiBaseUrl}/General/configuracion/parroquia`); expect(req.request.method).toBe('GET'); req.flush({});
        const payload = { nombreParroquia: 'Parroquia Demo', lugarExpedicion: 'Pueblo Nuevo', direccion: null, distrito: null, provincia: null, departamento: null, telefono: null, correo: null, ruc: null, nombreParroco: null, rowVersion: 'AAAA' };
        service.updateParroquia(payload).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/parroquia`); expect(req.request.method).toBe('PUT'); expect(req.request.body).toEqual(payload); req.flush({});
    });
    it('should expose payment method maintenance endpoints', () => {
        service.getMetodosPago().subscribe(); let req = http.expectOne(`${apiBaseUrl}/General/configuracion/metodos-pago`); expect(req.request.method).toBe('GET'); req.flush([]);
        service.createMetodoPago({ codigo: 'YAPE', nombre: 'Yape' }).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/metodos-pago`); expect(req.request.method).toBe('POST'); req.flush({});
        service.updateMetodoPago(2,{ codigo: 'YAPE', nombre: 'Yape', rowVersion: 'BBBB' }).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/metodos-pago/2`); expect(req.request.method).toBe('PUT'); req.flush({});
        service.changeMetodoPagoStatus(2,{ isActive: false, rowVersion: 'CCCC' }).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/metodos-pago/2/estado`); expect(req.request.method).toBe('PATCH'); req.flush({});
    });
    it('should expose receipt type maintenance endpoints', () => {
        service.getTiposComprobante().subscribe(); let req = http.expectOne(`${apiBaseUrl}/General/configuracion/tipos-comprobante`); expect(req.request.method).toBe('GET'); req.flush([]);
        service.createTipoComprobante({ codigo: 'TICKET', nombre: 'Ticket interno', serieDefault: 'T001' }).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/tipos-comprobante`); expect(req.request.method).toBe('POST'); req.flush({});
        service.updateTipoComprobante(1,{ codigo: 'TICKET', nombre: 'Ticket interno', serieDefault: 'T001', rowVersion: 'DDDD' }).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/tipos-comprobante/1`); expect(req.request.method).toBe('PUT'); req.flush({});
        service.changeTipoComprobanteStatus(1,{ isActive: false, rowVersion: 'EEEE' }).subscribe(); req = http.expectOne(`${apiBaseUrl}/General/configuracion/tipos-comprobante/1/estado`); expect(req.request.method).toBe('PATCH'); req.flush({});
    });

    it('should expose receipt series maintenance endpoints',()=>{
        service.getSeriesComprobante().subscribe();let req=http.expectOne(`${apiBaseUrl}/General/configuracion/series-comprobante`);expect(req.request.method).toBe('GET');req.flush([]);
        service.createSerieComprobante({idTipoComprobante:1,serie:'T002',primerNumero:500}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/series-comprobante`);expect(req.request.method).toBe('POST');req.flush({});
        service.updateSerieInicio(1,'T002',{primerNumero:700,rowVersion:'AAAA'}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/series-comprobante/1/T002/inicio`);expect(req.request.method).toBe('PUT');req.flush({});
        service.setSerieDefault(1,'T002',{tipoRowVersion:'BBBB'}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/series-comprobante/1/T002/predeterminada`);expect(req.request.method).toBe('PATCH');req.flush({});
    });
    it('should expose mass price maintenance endpoints',()=>{
        service.getMisaPrecioOpciones().subscribe();let req=http.expectOne(`${apiBaseUrl}/General/configuracion/precios-misa/opciones`);expect(req.request.method).toBe('GET');req.flush([]);
        service.getMisaPrecios().subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/precios-misa`);expect(req.request.method).toBe('GET');req.flush([]);
        service.createMisaPrecio({idModalidad:1,idTipo:2,precio:50,modoCalculo:'FIJO'}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/precios-misa`);expect(req.request.method).toBe('POST');req.flush({});
        service.deactivateMisaPrecio(5,{rowVersion:'CCCC'}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/precios-misa/5/desactivar`);expect(req.request.method).toBe('PATCH');req.flush({});
    });

    it('should expose service category maintenance endpoints',()=>{
        service.getCategoriasServicio().subscribe();let req=http.expectOne(`${apiBaseUrl}/General/configuracion/categorias-servicio`);expect(req.request.method).toBe('GET');req.flush([]);
        service.createCategoriaServicio({codigo:'DOCUMENTOS',nombre:'Documentos',descripcion:null}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/categorias-servicio`);expect(req.request.method).toBe('POST');req.flush({});
        service.updateCategoriaServicio(2,{codigo:'DOCUMENTOS',nombre:'Documentos parroquiales',descripcion:null,rowVersion:'AAAA'}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/categorias-servicio/2`);expect(req.request.method).toBe('PUT');req.flush({});
        service.changeCategoriaServicioStatus(2,{isActive:false,rowVersion:'BBBB'}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/categorias-servicio/2/estado`);expect(req.request.method).toBe('PATCH');req.flush({});
    });
    it('should expose product category and brand maintenance endpoints',()=>{
        service.getCategoriasProducto().subscribe();let req=http.expectOne(`${apiBaseUrl}/General/configuracion/categorias-producto`);expect(req.request.method).toBe('GET');req.flush([]);
        service.createCategoriaProducto({codigo:'LIBROS',nombre:'Libros',descripcion:null}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/categorias-producto`);expect(req.request.method).toBe('POST');req.flush({});
        service.changeCategoriaProductoStatus(1,{isActive:false,rowVersion:'CCCC'}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/categorias-producto/1/estado`);expect(req.request.method).toBe('PATCH');req.flush({});
        service.getMarcasProducto().subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/marcas-producto`);expect(req.request.method).toBe('GET');req.flush([]);
        service.createMarcaProducto({codigo:'SAN_PABLO',nombre:'San Pablo',descripcion:null}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/marcas-producto`);expect(req.request.method).toBe('POST');req.flush({});
        service.updateMarcaProducto(1,{codigo:'SAN_PABLO',nombre:'San Pablo',descripcion:'Editorial',rowVersion:'DDDD'}).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/marcas-producto/1`);expect(req.request.method).toBe('PUT');req.flush({});
    });

    it('should expose print queue safety endpoints',()=>{
        service.getColaImpresion().subscribe();let req=http.expectOne(`${apiBaseUrl}/General/configuracion/impresion/cola`);expect(req.request.method).toBe('GET');req.flush({});
        const payload={colaHabilitada:false,maxAntiguedadAutomaticaMinutos:10,maxAntiguedadManualMinutos:60,rowVersion:'QQQQ'};
        service.updateColaImpresion(payload).subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/impresion/cola`);expect(req.request.method).toBe('PUT');expect(req.request.body).toEqual(payload);req.flush({});
        service.getResumenColaImpresion().subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/impresion/cola/resumen`);expect(req.request.method).toBe('GET');req.flush({});
        service.cancelarPendientesColaImpresion().subscribe();req=http.expectOne(`${apiBaseUrl}/General/configuracion/impresion/cola/cancelar-pendientes`);expect(req.request.method).toBe('POST');req.flush({cantidadCancelada:0,mensaje:'OK'});
    });

    it('should get initial configuration status',()=>{
        service.getConfiguracionInicialEstado().subscribe();
        const req=http.expectOne(`${apiBaseUrl}/General/configuracion/inicial/estado`);
        expect(req.request.method).toBe('GET');
        req.flush({configuracionInicialCompletada:false,datosParroquiaOk:false,metodosPagoOk:false,cantidadMetodosPagoActivos:0,comprobantesSeriesOk:false,cantidadTiposComprobanteActivos:0,cantidadSeriesPredeterminadasActivas:0,serviciosOk:false,cantidadServiciosActivos:0,preciosMisaOk:false,cantidadPreciosMisaActivos:0,catalogosProductoOk:false,cantidadCategoriasProductoActivas:0,cantidadMarcasProductoActivas:0,impresionOk:false,impresionTicketConfigurada:false,impresionA4Configurada:false,colaHabilitada:false,pasosConfigurados:0,totalPasos:7,puedeFinalizar:false,configuracionInicialCompletadaUtc:null,configuracionInicialCompletadaBy:null});
    });

    it('should finalize initial configuration',()=>{
        service.finalizarConfiguracionInicial().subscribe();
        const req=http.expectOne(`${apiBaseUrl}/General/configuracion/inicial/finalizar`);
        expect(req.request.method).toBe('POST');
        req.flush({mensaje:'OK',estado:{configuracionInicialCompletada:true}});
    });


    it('consulta identidad de parroquia para la interfaz', () => {
        service.getIdentidadParroquia().subscribe();
        const req = http.expectOne(`${apiBaseUrl}/General/configuracion/parroquia/identidad`);
        expect(req.request.method).toBe('GET');
        req.flush({ nombreParroquia: 'Parroquia Demo', lugarExpedicion: 'Demo', direccion: null, distrito: null, provincia: null, departamento: null, telefono: null, ruc: null, configuracionInicialCompletada: true });
    });
});
