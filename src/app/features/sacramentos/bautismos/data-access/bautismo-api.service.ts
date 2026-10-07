import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RuntimeConfigService } from '../../../../core/config/runtime-config.service';
import { BautismoCreateRequest, BautismoDetail, BautismoFilters, BautismoListItem, BautismoMutationResponse, BautismoPartidaValidationRequest, BautismoPartidaValidationResponse, BautismoSiguientePartidaResponse, BautismoUpdateRequest } from './models/bautismo.models';

@Injectable({ providedIn: 'root' })
export class BautismoApiService {
    private readonly http=inject(HttpClient); private readonly runtimeConfig=inject(RuntimeConfigService);
    getList(filters:BautismoFilters={}):Observable<readonly BautismoListItem[]>{ return this.http.get<readonly BautismoListItem[]>(this.url,{params:this.buildParams(filters)}); }
    getById(id:number):Observable<BautismoDetail>{ return this.http.get<BautismoDetail>(`${this.url}/${id}`); }
    getByFolio(idFolioSacramental:number):Observable<readonly BautismoListItem[]>{ return this.http.get<readonly BautismoListItem[]>(`${this.url}/folio/${idFolioSacramental}`); }
    getSiguientePartida(idLibroSacramental:number):Observable<BautismoSiguientePartidaResponse>{ return this.http.get<BautismoSiguientePartidaResponse>(`${this.url}/libro/${idLibroSacramental}/siguiente-partida`); }
    validatePartida(request:BautismoPartidaValidationRequest):Observable<BautismoPartidaValidationResponse>{ return this.http.post<BautismoPartidaValidationResponse>(`${this.url}/validar-partida`,request); }
    create(request:BautismoCreateRequest):Observable<BautismoMutationResponse>{ return this.http.post<BautismoMutationResponse>(this.url,request); }
    update(id:number,request:BautismoUpdateRequest):Observable<BautismoMutationResponse>{ return this.http.put<BautismoMutationResponse>(`${this.url}/${id}`,request); }
    private buildParams(filters:BautismoFilters):HttpParams { let p=new HttpParams(); if(filters.idLibroSacramental!=null)p=p.set('idLibroSacramental',filters.idLibroSacramental); if(filters.idFolioSacramental!=null)p=p.set('idFolioSacramental',filters.idFolioSacramental); if(filters.dni?.trim())p=p.set('dni',filters.dni.trim()); if(filters.texto?.trim())p=p.set('texto',filters.texto.trim()); if(filters.fechaBautismoDesde)p=p.set('fechaBautismoDesde',filters.fechaBautismoDesde); if(filters.fechaBautismoHasta)p=p.set('fechaBautismoHasta',filters.fechaBautismoHasta); return p; }
    private get url():string { return `${this.runtimeConfig.config.apiBaseUrl}/Bautismo`; }
}
