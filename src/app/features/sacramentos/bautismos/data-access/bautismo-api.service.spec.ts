import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { BautismoApiService } from './bautismo-api.service';

describe('BautismoApiService', () => {
    let service:BautismoApiService; let http:HttpTestingController; const apiBaseUrl='https://localhost:9001/api';
    beforeEach(()=>{TestBed.configureTestingModule({providers:[BautismoApiService,provideHttpClient(),provideHttpClientTesting(),{provide:RuntimeConfigService,useValue:{config:{apiBaseUrl}}}]});service=TestBed.inject(BautismoApiService);http=TestBed.inject(HttpTestingController);});
    afterEach(()=>http.verify());
    it('should request filtered baptisms',()=>{service.getList({texto:'Perez',dni:'12345678',idLibroSacramental:7}).subscribe();const req=http.expectOne(r=>r.url===`${apiBaseUrl}/Bautismo`);expect(req.request.method).toBe('GET');expect(req.request.params.get('texto')).toBe('Perez');expect(req.request.params.get('dni')).toBe('12345678');expect(req.request.params.get('idLibroSacramental')).toBe('7');req.flush([]);});
    it('should validate and create a baptism',()=>{service.validatePartida({idLibroSacramental:7,idFolioSacramental:23,numeroPartida:'159'}).subscribe();let req=http.expectOne(`${apiBaseUrl}/Bautismo/validar-partida`);expect(req.request.method).toBe('POST');req.flush({idLibroSacramental:7,numeroLibro:'11',idFolioSacramental:23,numeroFolio:'24',numeroPartidaIngresada:'159',numeroPartidaNumerica:159,ultimaPartidaNumerica:157,partidaEsperada:158,esDuplicada:false,requiereConfirmacion:true,codigoValidacion:'SALTO',mensaje:'Verifique'});service.create({idLibroSacramental:7,idFolioSacramental:23,numeroPartida:'159',dni:null,apellidos:'PEREZ',nombres:'JUAN',fechaNacimiento:null,lugarNacimiento:null,nombrePadre:null,nombreMadre:null,fechaBautismo:null,lugarBautismo:null,padrino:null,madrina:null,ministro:null,notaMarginal:null,observaciones:null,confirmarSecuencia:true}).subscribe();req=http.expectOne(`${apiBaseUrl}/Bautismo`);expect(req.request.body.confirmarSecuencia).toBe(true);req.flush({idBautismo:1,mensaje:'OK'});});
    it('should request next part number by book',()=>{service.getSiguientePartida(7).subscribe();const req=http.expectOne(`${apiBaseUrl}/Bautismo/libro/7/siguiente-partida`);expect(req.request.method).toBe('GET');req.flush({idLibroSacramental:7,numeroLibro:'11',ultimaPartidaNumerica:157,siguientePartidaSugerida:158});});
});
