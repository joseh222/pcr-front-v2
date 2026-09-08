import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { LicenciamientoApiService } from '../../data-access/licenciamiento-api.service';
import { LicenciaSistemaPage } from './licencia-sistema';
import { ModuleStore } from '../../data-access/module.store';

describe('LicenciaSistemaPage',()=>{
    let fixture:ComponentFixture<LicenciaSistemaPage>;
    const api={
        getStatus:()=>of({productCode:'PCR',installationId:'11111111-1111-1111-1111-111111111111',installationCode:'PCR-11111111-1111-1111-1111-111111111111',parishName:'Parroquia Demo',estado:'SIN_LICENCIA',licenciamientoConfigurado:false,licenciaValida:false,licenseId:null,customerName:null,licenseType:null,keyId:null,issuedAtUtc:null,expiresAtUtc:null,activatedAtUtc:null,activatedBy:null,mensaje:'Sin licencia',modulos:[{codigo:'CORE',nombre:'Núcleo',descripcion:null,esCore:true,habilitado:true,dependencias:[]}]}),
        getHistory:()=>of([]),getRequest:()=>of({schemaVersion:1,productCode:'PCR',installationId:'11111111-1111-1111-1111-111111111111',installationCode:'PCR-111',parishName:'Demo',appVersion:'1',generatedAtUtc:'2026-09-07',modules:[]}),activate:()=>of({exito:true,codigo:'ACTIVATED',mensaje:'OK',estado:{}})
    };
    const auth={hasPermission:()=>true,permissions:signal<string[]>([]).asReadonly()};
    beforeEach(async()=>{
        await TestBed.configureTestingModule({imports:[LicenciaSistemaPage],providers:[{provide:LicenciamientoApiService,useValue:api},{provide:AuthStore,useValue:auth},{provide:ModuleStore,useValue:{setStatus:()=>undefined}}]}).compileComponents();
        fixture=TestBed.createComponent(LicenciaSistemaPage); fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();
    });
    it('muestra el código de instalación y CORE',()=>{
        expect(fixture.nativeElement.textContent).toContain('PCR-11111111-1111-1111-1111-111111111111');
        expect(fixture.nativeElement.textContent).toContain('Núcleo');
    });
    it('presenta la selección de licencia como un botón visible',()=>{
        expect(fixture.nativeElement.textContent).toContain('Seleccionar archivo .pcrlic');
        expect(fixture.nativeElement.textContent).toContain('Ningún archivo seleccionado');
    });
});
