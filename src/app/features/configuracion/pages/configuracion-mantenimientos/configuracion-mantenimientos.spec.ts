import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ConfiguracionMantenimientosPage } from './configuracion-mantenimientos';
import { ConfiguracionParroquiaIdentidadStore } from '../../data-access/configuracion-parroquia-identidad.store';
import { ConfiguracionApiService } from '../../data-access/configuracion-api.service';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';

describe('ConfiguracionMantenimientosPage',()=>{
    it('carga parroquia, catálogos, series y tarifas',()=>{
        const api:any={
            getParroquia:()=>of({idConfiguracion:1,nombreParroquia:'PARROQUIA TEST',lugarExpedicion:'LIMA',direccion:null,distrito:null,provincia:null,departamento:null,telefono:null,correo:null,ruc:null,nombreParroco:null,configuracionInicialCompletada:false,configuracionInicialCompletadaUtc:null,configuracionInicialCompletadaBy:null,updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}),
            getMetodosPago:()=>of(Array.from({length:6},(_,i)=>({idMetodoPago:i+1,codigo:`PAGO_${i+1}`,nombre:i===0?'Efectivo':`Pago ${i+1}`,isActive:true,createdUtc:'2026-01-01',updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}))),
            getTiposComprobante:()=>of([{idTipoComprobante:1,codigo:'TICKET',nombre:'Ticket',serieDefault:'T001',isActive:true,ultimoNumero:0,tieneMovimientos:false,createdUtc:'2026-01-01',updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}]),
            getSeriesComprobante:()=>of([{idTipoComprobante:1,codigoTipoComprobante:'TICKET',nombreTipoComprobante:'Ticket',serie:'T001',ultimoNumero:0,siguienteNumero:1,isActive:true,esPredeterminada:true,tieneMovimientos:false,createdUtc:'2026-01-01',updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA=',tipoRowVersion:'BBBBBBBBBBB='}]),
            getMisaPrecioOpciones:()=>of([{idModalidad:1,nombreModalidad:'Personal',idTipo:1,codigoTipo:'SALUD',nombreTipo:'Salud'}]),
            getMisaPrecios:()=>of([{idPrecio:1,idModalidad:1,nombreModalidad:'Personal',idTipo:1,codigoTipo:'SALUD',nombreTipo:'Salud',precio:50,modoCalculo:'FIJO',fechaVigencia:'2026-01-01',fechaFin:null,esActivo:true,createdBy:null,updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}]),
            getCategoriasServicio:()=>of([{id:1,codigo:'CELEBRACIONES',nombre:'Celebraciones',descripcion:'Servicios litúrgicos',isActive:true,tieneDependenciasActivas:true,createdUtc:'2026-01-01',updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}]),
            getCategoriasProducto:()=>of([{id:1,codigo:'LIBROS',nombre:'Libros',descripcion:null,isActive:true,tieneDependenciasActivas:false,createdUtc:'2026-01-01',updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}]),
            getMarcasProducto:()=>of([{id:1,codigo:'SAN_PABLO',nombre:'San Pablo',descripcion:null,isActive:true,tieneDependenciasActivas:false,createdUtc:'2026-01-01',updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}])
        };
        TestBed.configureTestingModule({imports:[ConfiguracionMantenimientosPage],providers:[provideNoopAnimations(),provideRouter([]),{provide:ConfiguracionApiService,useValue:api},{provide:FeedbackService,useValue:{success:()=>{},error:()=>{},warning:()=>{}}},{provide:AuthStore,useValue:{hasPermission:(_c:string)=>true}},{provide:ConfiguracionParroquiaIdentidadStore,useValue:{load:()=>Promise.resolve({})}}]});
        const fixture=TestBed.createComponent(ConfiguracionMantenimientosPage);fixture.detectChanges();const text=fixture.nativeElement.textContent;
        expect(text).toContain('PARROQUIA TEST');expect(text).toContain('Efectivo');expect(text).toContain('Pago 5');expect(text).not.toContain('Pago 6');expect(text).toContain('T001');expect(text).toContain('Precios de Misas');expect(text).toContain('S/ 50.00');expect(text).toContain('Celebraciones');expect(text).toContain('Libros');expect(text).toContain('San Pablo');expect(text).not.toMatch(/16\.\d/);
    });
});
