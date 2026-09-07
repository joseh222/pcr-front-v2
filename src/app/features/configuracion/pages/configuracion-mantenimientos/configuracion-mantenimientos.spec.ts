import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfiguracionMantenimientosPage } from './configuracion-mantenimientos';
import { ConfiguracionApiService } from '../../data-access/configuracion-api.service';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';

describe('ConfiguracionMantenimientosPage',()=>{
    it('carga parroquia, métodos de pago y tipos de comprobante',()=>{
        const api:any={
            getParroquia:()=>of({idConfiguracion:1,nombreParroquia:'PARROQUIA TEST',lugarExpedicion:'LIMA',direccion:null,distrito:null,provincia:null,departamento:null,telefono:null,correo:null,ruc:null,nombreParroco:null,configuracionInicialCompletada:false,configuracionInicialCompletadaUtc:null,configuracionInicialCompletadaBy:null,updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}),
            getMetodosPago:()=>of([{idMetodoPago:1,codigo:'EFECTIVO',nombre:'Efectivo',isActive:true,createdUtc:'2026-01-01',updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}]),
            getTiposComprobante:()=>of([{idTipoComprobante:1,codigo:'TICKET',nombre:'Ticket',serieDefault:'T001',isActive:true,ultimoNumero:0,tieneMovimientos:false,createdUtc:'2026-01-01',updatedUtc:null,updatedBy:null,rowVersion:'AAAAAAAAAAA='}])
        };
        TestBed.configureTestingModule({imports:[ConfiguracionMantenimientosPage],providers:[provideNoopAnimations(),{provide:ConfiguracionApiService,useValue:api},{provide:FeedbackService,useValue:{success:()=>{},error:()=>{},warning:()=>{}}},{provide:AuthStore,useValue:{hasPermission:(_c:string)=>true}}]});
        const fixture=TestBed.createComponent(ConfiguracionMantenimientosPage); fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('PARROQUIA TEST'); expect(fixture.nativeElement.textContent).toContain('Efectivo'); expect(fixture.nativeElement.textContent).toContain('T001');
    });
});
