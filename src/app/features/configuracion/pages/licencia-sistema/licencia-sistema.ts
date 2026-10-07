import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { PERMISSION_CODE } from '../../../../core/auth/permission-code.model';
import { LicenciamientoApiService } from '../../data-access/licenciamiento-api.service';
import { LicenciaHistorial, LicenciamientoEstado } from '../../data-access/models/licenciamiento.models';
import { ModuleStore } from '../../data-access/module.store';

@Component({
    selector:'app-licencia-sistema',
    standalone:true,
    imports:[MatButtonModule,MatCardModule,MatIconModule,RouterLink],
    templateUrl:'./licencia-sistema.html',
    styleUrl:'./licencia-sistema.scss'
})
export class LicenciaSistemaPage implements OnInit {
    private readonly api=inject(LicenciamientoApiService);
    private readonly moduleStore=inject(ModuleStore);
    protected readonly auth=inject(AuthStore);
    protected readonly estado=signal<LicenciamientoEstado|null>(null);
    protected readonly historial=signal<readonly LicenciaHistorial[]>([]);
    protected readonly loading=signal(false);
    protected readonly importing=signal(false);
    protected readonly error=signal<string|null>(null);
    protected readonly success=signal<string|null>(null);
    protected readonly selectedFile=signal<File|null>(null);
    protected readonly canView=computed(()=>this.auth.hasPermission(PERMISSION_CODE.LICENSE_VIEW));
    protected readonly canUpdate=computed(()=>this.auth.hasPermission(PERMISSION_CODE.LICENSE_UPDATE));

    async ngOnInit():Promise<void>{ await this.refresh(); }

    protected async refresh():Promise<void>{
        this.loading.set(true); this.error.set(null);
        try{
            const [status,history]=await Promise.all([
                firstValueFrom(this.api.getStatus()),
                this.auth.hasPermission(PERMISSION_CODE.LICENSE_VIEW) ? firstValueFrom(this.api.getHistory()) : Promise.resolve([] as readonly LicenciaHistorial[])
            ]);
            this.estado.set(status); this.moduleStore.setStatus(status); this.historial.set(history);
        }catch(error:any){ this.error.set(this.message(error,'No se pudo consultar el estado de licenciamiento.')); }
        finally{ this.loading.set(false); }
    }

    protected async copyInstallationCode():Promise<void>{
        const code=this.estado()?.installationCode; if(!code) return;
        try{ await navigator.clipboard.writeText(code); this.success.set('Código de instalación copiado.'); }
        catch{ this.error.set('No se pudo copiar automáticamente. Selecciona el código y cópialo manualmente.'); }
    }

    protected async exportRequest():Promise<void>{
        this.error.set(null); this.success.set(null);
        try{
            const request=await firstValueFrom(this.api.getRequest());
            const json=JSON.stringify(request,null,2);
            const blob=new Blob([json],{type:'application/json;charset=utf-8'});
            const url=URL.createObjectURL(blob);
            const anchor=document.createElement('a');
            const short=request.installationId.replaceAll('-','').slice(0,8).toUpperCase();
            anchor.href=url; anchor.download=`PCR_${short}.pcrrequest`; anchor.click();
            URL.revokeObjectURL(url);
            this.success.set('Solicitud de licencia generada. Envíala al propietario de PCR.');
        }catch(error:any){ this.error.set(this.message(error,'No se pudo generar la solicitud de licencia.')); }
    }

    protected openFilePicker(input:HTMLInputElement):void{
        if(!this.canUpdate()||this.importing()) return;
        input.value='';
        input.click();
    }

    protected fileSelected(event:Event):void{
        const input=event.target as HTMLInputElement;
        this.selectedFile.set(input.files?.item(0) ?? null);
        this.success.set(null); this.error.set(null);
    }

    protected async importLicense():Promise<void>{
        const file=this.selectedFile(); if(!file||!this.canUpdate()||this.importing()) return;
        this.importing.set(true); this.error.set(null); this.success.set(null);
        try{
            if(!file.name.toLowerCase().endsWith('.pcrlic')) throw new Error('Selecciona un archivo .pcrlic generado por PCR License Generator.');
            const contenido=await file.text();
            const response=await firstValueFrom(this.api.activate(contenido));
            this.estado.set(response.estado); this.moduleStore.setStatus(response.estado); this.success.set(response.mensaje); this.selectedFile.set(null);
            this.historial.set(await firstValueFrom(this.api.getHistory()));
        }catch(error:any){ this.error.set(this.message(error,error?.message ?? 'No se pudo importar la licencia.')); }
        finally{ this.importing.set(false); }
    }

    protected moduleState(enabled:boolean):string{ return enabled?'Habilitado':'No habilitado'; }

    private message(error:any,fallback:string):string{
        return error?.error?.messages?.[0] ?? error?.error?.message?.[0] ?? error?.error?.message ?? fallback;
    }
}
