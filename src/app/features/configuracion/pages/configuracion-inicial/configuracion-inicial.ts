import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { MODULE_CODE } from '../../../../core/licensing/module-code.model';
import { ConfiguracionInicialStore } from '../../data-access/configuracion-inicial.store';
import { ModuleStore } from '../../data-access/module.store';
import { ConfirmActionDialog } from '../../../../shared/pages/dialogs/confirm-action-dialog/confirm-action-dialog';

interface SetupStep {
    id: string;
    title: string;
    description: string;
    ok: boolean;
    detail: string;
    route: string;
    icon: string;
    required: boolean;
}

@Component({
    selector:'app-configuracion-inicial', standalone:true,
    imports:[MatButtonModule,MatCardModule,MatIconModule,MatDialogModule],
    templateUrl:'./configuracion-inicial.html', styleUrl:'./configuracion-inicial.scss'
})
export class ConfiguracionInicialPage implements OnInit {
    private readonly router=inject(Router);
    private readonly dialog=inject(MatDialog);
    protected readonly store=inject(ConfiguracionInicialStore);
    protected readonly modules=inject(ModuleStore);
    protected readonly auth=inject(AuthStore);
    protected readonly error=signal<string|null>(null);
    protected readonly success=signal<string|null>(null);
    protected readonly finalizing=signal(false);
    protected readonly state=this.store.state;
    protected readonly licenseState=this.modules.state;
    protected readonly licenseValid=computed(()=>this.licenseState()?.licenciaValida === true);

    protected readonly steps=computed<readonly SetupStep[]>(()=>{
        const s=this.state();
        const license=this.licenseState();
        if(!s) return [];

        const result: SetupStep[]=[
            {
                id:'license',
                title:'Licencia del sistema',
                description:'Activa esta instalación con una licencia emitida para su código de instalación.',
                ok:license?.licenciaValida === true,
                detail:license?.licenciaValida ? `${license.customerName ?? 'Licencia activa'} · ${license.licenseType ?? 'PERPETUAL'}` : (license?.mensaje ?? 'Obligatorio antes de continuar'),
                route:'/configuracion/licencia',
                icon:'vpn_key',
                required:true
            }
        ];

        // Antes de activar la licencia, el único paso operativo es la activación.
        if(license?.licenciaValida !== true) return result;

        result.push({
            id:'parish',
            title:'Datos de la parroquia',
            description:'Nombre, lugar de expedición y datos institucionales.',
            ok:s.datosParroquiaOk,
            detail:s.datosParroquiaOk?'Datos generales completos':'Obligatorio para finalizar',
            route:'/configuracion/mantenimientos',
            icon:'church',
            required:true
        });

        const sales=this.modules.isEnabled(MODULE_CODE.SALES);
        const services=this.modules.isEnabled(MODULE_CODE.SERVICES);
        const masses=this.modules.isEnabled(MODULE_CODE.MASSES);
        const inventory=this.modules.isEnabled(MODULE_CODE.INVENTORY);
        const sacraments=this.modules.isEnabled(MODULE_CODE.SACRAMENTS);

        if(sales){
            result.push(
                { id:'payments', title:'Métodos de pago',description:'Define cómo podrá cobrar la parroquia.',ok:s.metodosPagoOk,detail:`${s.cantidadMetodosPagoActivos} método(s) activo(s)`,route:'/configuracion/mantenimientos',icon:'payments',required:false },
                { id:'receipts', title:'Comprobantes y series',description:'Tipos de comprobante y su serie predeterminada.',ok:s.comprobantesSeriesOk,detail:`${s.cantidadTiposComprobanteActivos} tipo(s), ${s.cantidadSeriesPredeterminadasActivas} serie(s) lista(s)`,route:'/configuracion/mantenimientos',icon:'receipt_long',required:false }
            );
        }

        if(services){
            result.push({ id:'services', title:'Servicios parroquiales',description:'Servicios, precios y requisitos utilizados por las solicitudes.',ok:s.serviciosOk,detail:`${s.cantidadServiciosActivos} servicio(s) activo(s)`,route:'/catalogos/servicios',icon:'design_services',required:false });
        }

        if(masses){
            result.push({ id:'mass-prices', title:'Tarifas de Misas',description:'Precios vigentes por modalidad y tipo de Misa.',ok:s.preciosMisaOk,detail:`${s.cantidadPreciosMisaActivos} tarifa(s) activa(s)`,route:'/configuracion/mantenimientos',icon:'volunteer_activism',required:false });
        }

        if(inventory){
            result.push({ id:'inventory-catalogs', title:'Categorías y marcas de productos',description:'Catálogos base para registrar y organizar productos.',ok:s.catalogosProductoOk,detail:`${s.cantidadCategoriasProductoActivas} categoría(s), ${s.cantidadMarcasProductoActivas} marca(s)`,route:'/configuracion/mantenimientos',icon:'category',required:false });
        }

        if(sales){
            result.push({
                id:'ticket-print',
                title:'Impresión de tickets',
                description:'Configura la ticketera utilizada por Ventas y la seguridad de la cola de impresión.',
                ok:s.impresionTicketConfigurada,
                detail:`Ticket: ${s.impresionTicketConfigurada?'configurado':'pendiente'} · Cola: ${s.colaHabilitada?'habilitada':'pausada'}`,
                route:'/configuracion/impresion',
                icon:'receipt',
                required:false
            });
        }

        if(masses || sacraments){
            result.push({
                id:'a4-print',
                title:sacraments ? 'Constancias e impresión A4' : 'Impresión A4',
                description:sacraments ? 'Configura la impresora A4 y los parámetros usados para emitir constancias sacramentales.' : 'Configura la impresora A4 utilizada por los documentos de Misas.',
                ok:s.impresionA4Configurada,
                detail:`A4: ${s.impresionA4Configurada?'configurada':'pendiente'}`,
                route:'/configuracion/impresion',
                icon:'print',
                required:false
            });
        }

        return result;
    });

    protected readonly configuredSteps=computed(()=>this.steps().filter(step=>step.ok).length);
    protected readonly totalSteps=computed(()=>this.steps().length);
    protected readonly enabledCommercialModules=computed(()=>
        this.licenseState()?.modulos.filter(module=>!module.esCore && module.habilitado).map(module=>module.nombre) ?? []
    );

    protected readonly canFinish=computed(()=>{
        const s=this.state();
        return this.licenseValid()
            && !!s?.puedeFinalizar
            && this.auth.hasPermission(PERMISSION_CODE.INITIAL_SETUP_FINISH)
            && !s.configuracionInicialCompletada;
    });

    async ngOnInit(): Promise<void> { await this.refresh(); }

    protected async refresh(): Promise<void> {
        this.error.set(null);
        try {
            await Promise.all([this.store.load(true),this.modules.load(true)]);
        } catch {
            this.error.set('No se pudo consultar el estado de configuración o licenciamiento. Revisa la conexión con el Back e intenta nuevamente.');
        }
    }

    protected async go(route:string): Promise<void> { await this.router.navigateByUrl(route); }

    protected async finish(): Promise<void> {
        if(!this.canFinish()||this.finalizing()) return;

        const confirmed=await firstValueFrom(
            this.dialog.open(ConfirmActionDialog,{
                width:'min(560px, calc(100vw - 2rem))',
                disableClose:true,
                data:{
                    title:'Finalizar configuración inicial',
                    message:'¿Deseas finalizar la configuración inicial y habilitar los módulos operativos licenciados? Los datos ya configurados no se reiniciarán y los cambios posteriores se realizarán desde Configuración.',
                    cancelText:'Cancelar',
                    confirmText:'Finalizar y habilitar',
                    icon:'warning'
                }
            }).afterClosed()
        );

        if(!confirmed) return;

        this.error.set(null); this.success.set(null); this.finalizing.set(true);
        try {
            const r=await this.store.finalizar();
            this.success.set(r.mensaje);
            await this.router.navigateByUrl('/dashboard');
        }
        catch(error:any) {
            this.error.set(error?.error?.messages?.[0] ?? error?.error?.message?.[0] ?? 'No se pudo finalizar la configuración inicial.');
        }
        finally { this.finalizing.set(false); }
    }
}
