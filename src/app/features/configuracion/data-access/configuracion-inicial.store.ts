import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfiguracionInicialEstado, ConfiguracionInicialFinalizarResponse } from './models/configuracion-inicial.models';
import { ConfiguracionApiService } from './configuracion-api.service';

@Injectable({ providedIn: 'root' })
export class ConfiguracionInicialStore {
    private readonly api=inject(ConfiguracionApiService);
    private readonly stateSignal=signal<ConfiguracionInicialEstado|null>(null);
    private readonly loadingSignal=signal(false);
    readonly state=this.stateSignal.asReadonly();
    readonly loading=this.loadingSignal.asReadonly();

    async load(force=false): Promise<ConfiguracionInicialEstado> {
        const cached=this.stateSignal();
        if(cached && !force) return cached;
        this.loadingSignal.set(true);
        try { const state=await firstValueFrom(this.api.getConfiguracionInicialEstado()); this.stateSignal.set(state); return state; }
        finally { this.loadingSignal.set(false); }
    }

    async finalizar(): Promise<ConfiguracionInicialFinalizarResponse> {
        this.loadingSignal.set(true);
        try { const response=await firstValueFrom(this.api.finalizarConfiguracionInicial()); this.stateSignal.set(response.estado); return response; }
        finally { this.loadingSignal.set(false); }
    }

    invalidate(): void { this.stateSignal.set(null); }
}
