import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { ConfiguracionInicialStore } from '../../data-access/configuracion-inicial.store';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';

interface SetupStep { title:string; description:string; ok:boolean; detail:string; route:string; icon:string; required:boolean; }

@Component({
    selector:'app-configuracion-inicial', standalone:true,
    imports:[MatButtonModule,MatCardModule,MatIconModule,MatDialogModule],
    templateUrl:'./configuracion-inicial.html', styleUrl:'./configuracion-inicial.scss'
})
export class ConfiguracionInicialPage implements OnInit {
    private readonly router=inject(Router);
    private readonly dialog=inject(MatDialog);
    protected readonly store=inject(ConfiguracionInicialStore);
    protected readonly auth=inject(AuthStore);
    protected readonly error=signal<string|null>(null);
    protected readonly success=signal<string|null>(null);
    protected readonly finalizing=signal(false);
    protected readonly state=this.store.state;

    protected readonly steps=computed<readonly SetupStep[]>(()=>{
        const s=this.state(); if(!s) return [];
        return [
            { title:'Datos de la parroquia',description:'Nombre, lugar de expedición y datos institucionales.',ok:s.datosParroquiaOk,detail:s.datosParroquiaOk?'Datos generales completos':'Obligatorio para finalizar',route:'/configuracion/mantenimientos',icon:'church',required:true },
            { title:'Métodos de pago',description:'Define cómo podrá cobrar la parroquia.',ok:s.metodosPagoOk,detail:`${s.cantidadMetodosPagoActivos} método(s) activo(s)`,route:'/configuracion/mantenimientos',icon:'payments',required:false },
            { title:'Comprobantes y series',description:'Tipos de comprobante y su serie predeterminada.',ok:s.comprobantesSeriesOk,detail:`${s.cantidadTiposComprobanteActivos} tipo(s), ${s.cantidadSeriesPredeterminadasActivas} serie(s) lista(s)`,route:'/configuracion/mantenimientos',icon:'receipt_long',required:false },
            { title:'Servicios parroquiales',description:'Servicios, precios y sacramento requerido.',ok:s.serviciosOk,detail:`${s.cantidadServiciosActivos} servicio(s) activo(s)`,route:'/catalogos/servicios',icon:'design_services',required:false },
            { title:'Tarifas de Misas',description:'Precios vigentes por modalidad y tipo.',ok:s.preciosMisaOk,detail:`${s.cantidadPreciosMisaActivos} tarifa(s) activa(s)`,route:'/configuracion/mantenimientos',icon:'volunteer_activism',required:false },
            { title:'Categorías y marcas',description:'Catálogos necesarios para registrar productos.',ok:s.catalogosProductoOk,detail:`${s.cantidadCategoriasProductoActivas} categoría(s), ${s.cantidadMarcasProductoActivas} marca(s)`,route:'/configuracion/mantenimientos',icon:'category',required:false },
            { title:'Impresión',description:'Ticketera, A4 y seguridad de la cola.',ok:s.impresionOk,detail:`Ticket: ${s.impresionTicketConfigurada?'sí':'no'} · A4: ${s.impresionA4Configurada?'sí':'no'} · Cola: ${s.colaHabilitada?'habilitada':'pausada'}`,route:'/configuracion/impresion',icon:'print',required:false }
        ];
    });

    protected readonly canFinish=computed(()=>{ const s=this.state(); return !!s?.puedeFinalizar && this.auth.hasPermission(PERMISSION_CODE.INITIAL_SETUP_FINISH) && !s.configuracionInicialCompletada; });

    async ngOnInit(): Promise<void> { await this.refresh(); }
    protected async refresh(): Promise<void> { this.error.set(null); try { await this.store.load(true); } catch { this.error.set('No se pudo consultar el estado de configuración. Revisa la conexión con el Back e intenta nuevamente.'); } }
    protected async go(route:string): Promise<void> { await this.router.navigateByUrl(route); }
    protected async finish(): Promise<void> {
        if(!this.canFinish()||this.finalizing()) return;

        const confirmed=await firstValueFrom(
            this.dialog.open(ConfirmActionDialog,{
                width:'min(560px, calc(100vw - 2rem))',
                disableClose:true,
                data:{
                    title:'Finalizar configuración inicial',
                    message:'¿Deseas finalizar la configuración inicial y habilitar los módulos operativos? Los datos ya configurados no se reiniciarán y los cambios posteriores se realizarán desde Configuración.',
                    cancelText:'Cancelar',
                    confirmText:'Finalizar y habilitar',
                    icon:'warning'
                }
            }).afterClosed()
        );

        if(!confirmed) return;

        this.error.set(null); this.success.set(null); this.finalizing.set(true);
        try { const r=await this.store.finalizar(); this.success.set(r.mensaje); await this.router.navigateByUrl('/dashboard'); }
        catch(error:any) { this.error.set(error?.error?.messages?.[0] ?? error?.error?.message?.[0] ?? 'No se pudo finalizar la configuración inicial.'); }
        finally { this.finalizing.set(false); }
    }
}
