import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; import { MatFormFieldModule } from '@angular/material/form-field'; import { MatIconModule } from '@angular/material/icon'; import { MatInputModule } from '@angular/material/input'; import { MatProgressBarModule } from '@angular/material/progress-bar'; import { MatSelectModule } from '@angular/material/select'; import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { PERMISSION_CODE } from '../../../../../core/auth/permission-code.model'; import { getApiErrorMessage } from '../../../../../core/feedback/api-error-message'; import { AuthStore } from '../../../../auth/data-access/auth.store';
import { LibroSacramentalApiService } from '../../../libros/data-access/libro-sacramental-api.service'; import { LibroSacramentalListItem } from '../../../libros/data-access/models/libro-sacramental.models';
import { BautismoApiService } from '../../data-access/bautismo-api.service'; import { BautismoListItem } from '../../data-access/models/bautismo.models';

@Component({selector:'pcr-bautismo-list',imports:[DatePipe,ReactiveFormsModule,RouterLink,MatButtonModule,MatFormFieldModule,MatIconModule,MatInputModule,MatProgressBarModule,MatSelectModule,MatTableModule],templateUrl:'./bautismo-list.html',styleUrl:'./bautismo-list.scss'})
export class BautismoListPage implements OnInit {
    private readonly api=inject(BautismoApiService); private readonly librosApi=inject(LibroSacramentalApiService); private readonly fb=inject(FormBuilder); private readonly auth=inject(AuthStore);
    protected readonly loading=signal(false); protected readonly error=signal<string|null>(null); protected readonly items=signal<readonly BautismoListItem[]>([]); protected readonly libros=signal<readonly LibroSacramentalListItem[]>([]); protected readonly canCreate=computed(()=>this.auth.hasPermission(PERMISSION_CODE.BAPTISM_CREATE)); protected readonly canEdit=computed(()=>this.auth.hasPermission(PERMISSION_CODE.BAPTISM_EDIT)); protected readonly displayedColumns=['referencia','persona','dni','fecha','padres','acciones'];
    readonly form=this.fb.group({texto:this.fb.nonNullable.control(''),dni:this.fb.nonNullable.control(''),idLibroSacramental:this.fb.control<number|null>(null),fechaBautismoDesde:this.fb.control<string|null>(null),fechaBautismoHasta:this.fb.control<string|null>(null)});
    ngOnInit():void{ this.loadLibros(); this.load(); }
    protected search():void{this.load();} protected clear():void{this.form.reset({texto:'',dni:'',idLibroSacramental:null,fechaBautismoDesde:null,fechaBautismoHasta:null});this.load();}
    private loadLibros():void{ this.librosApi.getTiposSacramento().subscribe({next:tipos=>{const tipo=tipos.find(x=>x.codigo==='BAUTISMO'); if(!tipo)return; this.librosApi.getList({idTipoSacramento:tipo.idTipoSacramento,soloActivos:true}).subscribe({next:x=>this.libros.set(x),error:e=>this.error.set(getApiErrorMessage(e,'No se pudieron cargar los libros de bautismo.'))});},error:e=>this.error.set(getApiErrorMessage(e,'No se pudo identificar el catálogo de Bautismo.'))}); }
    private load():void{this.loading.set(true);this.error.set(null);const r=this.form.getRawValue();this.api.getList(r).subscribe({next:x=>{this.items.set(x);this.loading.set(false);},error:e=>{this.items.set([]);this.error.set(getApiErrorMessage(e,'No se pudieron cargar los bautismos.'));this.loading.set(false);}});}
}
