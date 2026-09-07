import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { FeedbackService } from '../../../../core/feedback/feedback.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { ConfiguracionApiService } from '../../data-access/configuracion-api.service';
import { ConfiguracionParroquia, MetodoPagoMantenimiento, TipoComprobanteMantenimiento } from '../../data-access/models/configuracion-mantenimientos.models';

@Component({
    selector: 'pcr-configuracion-mantenimientos',
    imports: [ReactiveFormsModule,MatButtonModule,MatDialogModule,MatFormFieldModule,MatIconModule,MatInputModule,MatProgressBarModule,MatTableModule],
    templateUrl: './configuracion-mantenimientos.html', styleUrl: './configuracion-mantenimientos.scss'
})
export class ConfiguracionMantenimientosPage implements OnInit {
    private readonly fb=inject(FormBuilder); private readonly api=inject(ConfiguracionApiService); private readonly feedback=inject(FeedbackService); private readonly auth=inject(AuthStore); private readonly dialog=inject(MatDialog);
    protected readonly loading=signal(false); protected readonly savingParroquia=signal(false); protected readonly savingPago=signal(false); protected readonly savingTipo=signal(false);
    protected readonly parroquia=signal<ConfiguracionParroquia|null>(null); protected readonly metodosPago=signal<readonly MetodoPagoMantenimiento[]>([]); protected readonly tiposComprobante=signal<readonly TipoComprobanteMantenimiento[]>([]);
    protected readonly editingPago=signal<MetodoPagoMantenimiento|null>(null); protected readonly editingTipo=signal<TipoComprobanteMantenimiento|null>(null);
    protected readonly paymentColumns=['codigo','nombre','estado','acciones']; protected readonly receiptColumns=['codigo','nombre','serie','ultimo','estado','acciones'];
    protected readonly canParishView=()=>this.auth.hasPermission(PERMISSION_CODE.CONFIG_PARISH_VIEW); protected readonly canParishEdit=()=>this.auth.hasPermission(PERMISSION_CODE.CONFIG_PARISH_EDIT);
    protected readonly canPaymentView=()=>this.auth.hasPermission(PERMISSION_CODE.PAYMENT_METHOD_VIEW); protected readonly canPaymentCreate=()=>this.auth.hasPermission(PERMISSION_CODE.PAYMENT_METHOD_CREATE); protected readonly canPaymentEdit=()=>this.auth.hasPermission(PERMISSION_CODE.PAYMENT_METHOD_EDIT); protected readonly canPaymentStatus=()=>this.auth.hasPermission(PERMISSION_CODE.PAYMENT_METHOD_STATUS);
    protected readonly canReceiptView=()=>this.auth.hasPermission(PERMISSION_CODE.RECEIPT_TYPE_VIEW); protected readonly canReceiptCreate=()=>this.auth.hasPermission(PERMISSION_CODE.RECEIPT_TYPE_CREATE); protected readonly canReceiptEdit=()=>this.auth.hasPermission(PERMISSION_CODE.RECEIPT_TYPE_EDIT); protected readonly canReceiptStatus=()=>this.auth.hasPermission(PERMISSION_CODE.RECEIPT_TYPE_STATUS);

    protected readonly parishForm=this.fb.nonNullable.group({
        nombreParroquia:['',[Validators.required,Validators.maxLength(250)]], lugarExpedicion:['',[Validators.required,Validators.maxLength(150)]], direccion:['',Validators.maxLength(250)], distrito:['',Validators.maxLength(100)], provincia:['',Validators.maxLength(100)], departamento:['',Validators.maxLength(100)], telefono:['',Validators.maxLength(50)], correo:['',[Validators.email,Validators.maxLength(150)]], ruc:['',[Validators.pattern(/^$|^\d{11}$/)]], nombreParroco:['',Validators.maxLength(200)]
    });
    protected readonly paymentForm=this.fb.nonNullable.group({ codigo:['',[Validators.required,Validators.maxLength(30),Validators.pattern(/^[A-Za-z0-9_]+$/)]], nombre:['',[Validators.required,Validators.maxLength(80)]] });
    protected readonly receiptForm=this.fb.nonNullable.group({ codigo:['',[Validators.required,Validators.maxLength(30),Validators.pattern(/^[A-Za-z0-9_]+$/)]], nombre:['',[Validators.required,Validators.maxLength(100)]], serieDefault:['',[Validators.required,Validators.pattern(/^[A-Za-z0-9]{4}$/)]] });

    ngOnInit():void { this.reload(); }
    protected reload():void { this.loading.set(true); const calls:number[]=[]; if(this.canParishView()){calls.push(1);this.loadParroquia();} if(this.canPaymentView()){calls.push(1);this.loadPagos();} if(this.canReceiptView()){calls.push(1);this.loadTipos();} if(calls.length===0)this.loading.set(false); }

    protected saveParish():void { const current=this.parroquia(); if(!this.canParishEdit()||!current||this.parishForm.invalid||this.savingParroquia()){this.parishForm.markAllAsTouched();return;} const v=this.parishForm.getRawValue(); this.savingParroquia.set(true); this.api.updateParroquia({nombreParroquia:v.nombreParroquia.trim(),lugarExpedicion:v.lugarExpedicion.trim(),direccion:this.opt(v.direccion),distrito:this.opt(v.distrito),provincia:this.opt(v.provincia),departamento:this.opt(v.departamento),telefono:this.opt(v.telefono),correo:this.opt(v.correo),ruc:this.opt(v.ruc),nombreParroco:this.opt(v.nombreParroco),rowVersion:current.rowVersion}).subscribe({next:r=>{this.savingParroquia.set(false);this.applyParroquia(r);this.feedback.success('Datos de la parroquia actualizados.');},error:e=>{this.savingParroquia.set(false);this.feedback.error(getApiErrorMessage(e,'No se pudieron actualizar los datos de la parroquia.'));}}); }

    protected newPayment():void { if(!this.canPaymentCreate())return; this.editingPago.set(null); this.paymentForm.reset({codigo:'',nombre:''}); }
    protected editPayment(x:MetodoPagoMantenimiento):void { if(!this.canPaymentEdit())return; this.editingPago.set(x); this.paymentForm.reset({codigo:x.codigo,nombre:x.nombre}); }
    protected cancelPaymentEdit():void { this.editingPago.set(null); this.paymentForm.reset({codigo:'',nombre:''}); }
    protected normalizePaymentCode():void { this.paymentForm.controls.codigo.setValue(this.code(this.paymentForm.controls.codigo.value),{emitEvent:false}); }
    protected savePayment():void { if(this.paymentForm.invalid||this.savingPago()){this.paymentForm.markAllAsTouched();return;} const v=this.paymentForm.getRawValue(),current=this.editingPago(); const request={codigo:this.code(v.codigo),nombre:v.nombre.trim()}; const call=current?this.api.updateMetodoPago(current.idMetodoPago,{...request,rowVersion:current.rowVersion}):this.api.createMetodoPago(request); this.savingPago.set(true); call.subscribe({next:r=>{this.savingPago.set(false);this.feedback.success(r.mensaje);this.cancelPaymentEdit();this.loadPagos();},error:e=>{this.savingPago.set(false);this.feedback.error(getApiErrorMessage(e,'No se pudo guardar el método de pago.'));}}); }
    protected changePaymentStatus(x:MetodoPagoMantenimiento):void { if(!this.canPaymentStatus())return; this.confirm(x.isActive?'Desactivar método de pago':'Activar método de pago',`¿Deseas ${x.isActive?'desactivar':'activar'} ${x.nombre}? Las ventas históricas no se modificarán.`,x.isActive?'Desactivar':'Activar').subscribe(ok=>{if(!ok)return;this.api.changeMetodoPagoStatus(x.idMetodoPago,{isActive:!x.isActive,rowVersion:x.rowVersion}).subscribe({next:r=>{this.feedback.success(r.mensaje);this.loadPagos();},error:e=>this.feedback.error(getApiErrorMessage(e,'No se pudo cambiar el estado.'))});}); }

    protected newReceipt():void { if(!this.canReceiptCreate())return; this.editingTipo.set(null); this.receiptForm.reset({codigo:'',nombre:'',serieDefault:''}); }
    protected editReceipt(x:TipoComprobanteMantenimiento):void { if(!this.canReceiptEdit())return; this.editingTipo.set(x); this.receiptForm.reset({codigo:x.codigo,nombre:x.nombre,serieDefault:x.serieDefault}); }
    protected cancelReceiptEdit():void { this.editingTipo.set(null); this.receiptForm.reset({codigo:'',nombre:'',serieDefault:''}); }
    protected normalizeReceipt():void { this.receiptForm.controls.codigo.setValue(this.code(this.receiptForm.controls.codigo.value),{emitEvent:false}); this.receiptForm.controls.serieDefault.setValue(this.receiptForm.controls.serieDefault.value.trim().toUpperCase(),{emitEvent:false}); }
    protected saveReceipt():void { if(this.receiptForm.invalid||this.savingTipo()){this.receiptForm.markAllAsTouched();return;} const v=this.receiptForm.getRawValue(),current=this.editingTipo(); const request={codigo:this.code(v.codigo),nombre:v.nombre.trim(),serieDefault:v.serieDefault.trim().toUpperCase()}; const call=current?this.api.updateTipoComprobante(current.idTipoComprobante,{...request,rowVersion:current.rowVersion}):this.api.createTipoComprobante(request); this.savingTipo.set(true); call.subscribe({next:r=>{this.savingTipo.set(false);this.feedback.success(r.mensaje);this.cancelReceiptEdit();this.loadTipos();},error:e=>{this.savingTipo.set(false);this.feedback.error(getApiErrorMessage(e,'No se pudo guardar el tipo de comprobante.'));}}); }
    protected changeReceiptStatus(x:TipoComprobanteMantenimiento):void { if(!this.canReceiptStatus())return; this.confirm(x.isActive?'Desactivar tipo de comprobante':'Activar tipo de comprobante',`¿Deseas ${x.isActive?'desactivar':'activar'} ${x.nombre}? Los comprobantes ya emitidos conservarán su historial.`,x.isActive?'Desactivar':'Activar').subscribe(ok=>{if(!ok)return;this.api.changeTipoComprobanteStatus(x.idTipoComprobante,{isActive:!x.isActive,rowVersion:x.rowVersion}).subscribe({next:r=>{this.feedback.success(r.mensaje);this.loadTipos();},error:e=>this.feedback.error(getApiErrorMessage(e,'No se pudo cambiar el estado.'))});}); }

    private loadParroquia():void { this.api.getParroquia().subscribe({next:r=>{this.applyParroquia(r);this.loading.set(false);},error:e=>{this.loading.set(false);this.feedback.error(getApiErrorMessage(e,'No se pudieron cargar los datos de parroquia.'));}}); }
    private loadPagos():void { this.api.getMetodosPago().subscribe({next:r=>{this.metodosPago.set(r);this.loading.set(false);},error:e=>{this.loading.set(false);this.feedback.error(getApiErrorMessage(e,'No se pudieron cargar los métodos de pago.'));}}); }
    private loadTipos():void { this.api.getTiposComprobante().subscribe({next:r=>{this.tiposComprobante.set(r);this.loading.set(false);},error:e=>{this.loading.set(false);this.feedback.error(getApiErrorMessage(e,'No se pudieron cargar los tipos de comprobante.'));}}); }
    private applyParroquia(r:ConfiguracionParroquia):void { this.parroquia.set(r); this.parishForm.reset({nombreParroquia:r.nombreParroquia??'',lugarExpedicion:r.lugarExpedicion??'',direccion:r.direccion??'',distrito:r.distrito??'',provincia:r.provincia??'',departamento:r.departamento??'',telefono:r.telefono??'',correo:r.correo??'',ruc:r.ruc??'',nombreParroco:r.nombreParroco??''}); }
    private confirm(title:string,message:string,confirmText:string){return this.dialog.open(ConfirmActionDialog,{width:'min(520px, calc(100vw - 2rem))',data:{title,message,cancelText:'Cancelar',confirmText,icon:'settings'}}).afterClosed();}
    private opt(v:string):string|null { const x=v.trim(); return x||null; } private code(v:string):string{return v.trim().replace(/\s+/g,'_').toUpperCase();}
}
