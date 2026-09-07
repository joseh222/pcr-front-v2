import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfiguracionApiService } from './configuracion-api.service';
import { ConfiguracionParroquiaIdentidad } from './models/configuracion-identidad.models';

@Injectable({ providedIn: 'root' })
export class ConfiguracionParroquiaIdentidadStore {
    private readonly api = inject(ConfiguracionApiService);
    private readonly stateSignal = signal<ConfiguracionParroquiaIdentidad | null>(null);
    private loadingPromise: Promise<ConfiguracionParroquiaIdentidad> | null = null;

    readonly state = this.stateSignal.asReadonly();
    readonly nombreParroquia = computed(() => this.stateSignal()?.nombreParroquia?.trim() || 'Sistema de Gestión Parroquial');

    load(force = false): Promise<ConfiguracionParroquiaIdentidad> {
        if (!force && this.stateSignal()) return Promise.resolve(this.stateSignal()!);
        if (!force && this.loadingPromise) return this.loadingPromise;
        this.loadingPromise = firstValueFrom(this.api.getIdentidadParroquia())
            .then(value => { this.stateSignal.set(value); return value; })
            .finally(() => { this.loadingPromise = null; });
        return this.loadingPromise;
    }

    invalidate(): void { this.stateSignal.set(null); }
}
