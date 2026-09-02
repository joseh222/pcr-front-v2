import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { FeedbackService } from '../../../../../core/feedback/feedback.service';
import { LibroSacramentalApiService } from '../../../libros/data-access/libro-sacramental-api.service';
import { BautismoApiService } from '../../data-access/bautismo-api.service';
import { BautismoFormPage } from './bautismo-form';

describe('BautismoFormPage',()=>{
    const book:any={idLibroSacramental:7,idTipoSacramento:1,codigoTipoSacramento:'BAUTISMO',tipoSacramento:'Bautismo',numeroLibro:'11',codigoEstadoDigitalizacion:'EN_PROCESO'};
    const folio:any={idFolioSacramental:23,idLibroSacramental:7,numeroLibro:'11',numeroFolio:'24',ordenFolio:24,isActive:true,rowVersion:'A'};
    const api={getSiguientePartida:vi.fn(()=>of({idLibroSacramental:7,numeroLibro:'11',ultimaPartidaNumerica:157,siguientePartidaSugerida:158})),validatePartida:vi.fn(),create:vi.fn(),update:vi.fn(),getById:vi.fn()};
    const libros={getTiposSacramento:vi.fn(()=>of([{idTipoSacramento:1,codigo:'BAUTISMO',nombre:'Bautismo',orden:1}])),getList:vi.fn(()=>of([book])),getFolios:vi.fn(()=>of([folio])),getById:vi.fn(()=>of(book))};
    const feedback={success:vi.fn(),error:vi.fn(),warning:vi.fn(),info:vi.fn()};
    const dialog={open:vi.fn(()=>({afterClosed:()=>of(true)}))};
    beforeEach(()=>{vi.clearAllMocks();api.getSiguientePartida.mockReturnValue(of({idLibroSacramental:7,numeroLibro:'11',ultimaPartidaNumerica:157,siguientePartidaSugerida:158}));libros.getTiposSacramento.mockReturnValue(of([{idTipoSacramento:1,codigo:'BAUTISMO',nombre:'Bautismo',orden:1}]));libros.getList.mockReturnValue(of([book]));libros.getFolios.mockReturnValue(of([folio]));dialog.open.mockReturnValue({afterClosed:()=>of(true)} as any);TestBed.configureTestingModule({imports:[BautismoFormPage],providers:[provideRouter([]),{provide:ActivatedRoute,useValue:{snapshot:{paramMap:convertToParamMap({}),queryParamMap:convertToParamMap({libro:'7',folio:'23'})}}},{provide:BautismoApiService,useValue:api},{provide:LibroSacramentalApiService,useValue:libros},{provide:FeedbackService,useValue:feedback},{provide:MatDialog,useValue:dialog}]});});
    it('should suggest the next part number from the whole book',()=>{const f=TestBed.createComponent(BautismoFormPage);f.detectChanges();expect(api.getSiguientePartida).toHaveBeenCalledWith(7);expect(f.componentInstance.form.controls.numeroPartida.value).toBe('158');expect(f.componentInstance.form.controls.idFolioSacramental.value).toBe(23);});
    it('should require explicit confirmation when SQL validation reports a jump',()=>{api.validatePartida.mockReturnValue(of({idLibroSacramental:7,numeroLibro:'11',idFolioSacramental:23,numeroFolio:'24',numeroPartidaIngresada:'159',numeroPartidaNumerica:159,ultimaPartidaNumerica:157,partidaEsperada:158,esDuplicada:false,requiereConfirmacion:true,codigoValidacion:'SALTO',mensaje:'La siguiente partida esperada es 158.'}));api.create.mockReturnValue(of({idBautismo:9,mensaje:'OK'}));const f=TestBed.createComponent(BautismoFormPage);f.detectChanges();f.componentInstance.form.patchValue({numeroPartida:'159',apellidos:'PEREZ',nombres:'JUAN'});f.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));f.detectChanges();expect(api.validatePartida).toHaveBeenCalled();expect(dialog.open).toHaveBeenCalled();expect(api.create).toHaveBeenCalledWith(expect.objectContaining({numeroPartida:'159',confirmarSecuencia:true}));});
});
