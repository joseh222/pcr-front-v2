import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { SolicitudServicioApiService } from '../../data-access/solicitud-servicio-api.service';
import { RegistroSacramentalSearchItem } from '../../data-access/models/solicitud-servicio-read.models';

export interface RegistroSacramentalSelectorData { readonly codigoTipoSacramento:string; readonly nombreTipoSacramento:string; }
@Component({selector:'pcr-registro-sacramental-selector-dialog',standalone:true,imports:[ReactiveFormsModule,MatDialogModule,MatButtonModule,MatFormFieldModule,MatIconModule,MatInputModule,MatProgressBarModule],templateUrl:'./registro-sacramental-selector-dialog.html',styleUrl:'./registro-sacramental-selector-dialog.scss'})
export class RegistroSacramentalSelectorDialog{
 private readonly api=inject(SolicitudServicioApiService); private readonly fb=inject(FormBuilder); private readonly ref=inject(MatDialogRef<RegistroSacramentalSelectorDialog>); protected readonly data=inject<RegistroSacramentalSelectorData>(MAT_DIALOG_DATA);
 protected readonly loading=signal(false); protected readonly searched=signal(false); protected readonly error=signal<string|null>(null); protected readonly items=signal<readonly RegistroSacramentalSearchItem[]>([]);
 readonly form=this.fb.group({search:this.fb.nonNullable.control(''),dni:this.fb.nonNullable.control(''),numeroLibro:this.fb.nonNullable.control(''),numeroFolio:this.fb.nonNullable.control(''),numeroPartida:this.fb.nonNullable.control(''),fechaDesde:this.fb.control<string|null>(null),fechaHasta:this.fb.control<string|null>(null)});
 protected buscar(){this.loading.set(true);this.error.set(null);const v=this.form.getRawValue();this.api.searchRegistrosSacramentales({codigoTipoSacramento:this.data.codigoTipoSacramento,search:this.opt(v.search),dni:this.opt(v.dni),numeroLibro:this.opt(v.numeroLibro),numeroFolio:this.opt(v.numeroFolio),numeroPartida:this.opt(v.numeroPartida),fechaDesde:v.fechaDesde,fechaHasta:v.fechaHasta,top:30}).subscribe({next:x=>{this.items.set(x);this.searched.set(true);this.loading.set(false);},error:e=>{this.items.set([]);this.searched.set(true);this.loading.set(false);this.error.set(getApiErrorMessage(e,'No se pudieron buscar registros sacramentales.'));}});}
 protected limpiar(){this.form.reset({search:'',dni:'',numeroLibro:'',numeroFolio:'',numeroPartida:'',fechaDesde:null,fechaHasta:null});this.items.set([]);this.searched.set(false);this.error.set(null);}
 protected seleccionar(item:RegistroSacramentalSearchItem){this.ref.close(item);} private opt(v:string|null|undefined){return v?.trim()||null;}
}
