import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MODULE_CODE, ModuleCode } from '../../../core/licensing/module-code.model';
import { LicenciamientoApiService } from './licenciamiento-api.service';
import { LicenciamientoEstado } from './models/licenciamiento.models';

@Injectable({ providedIn: 'root' })
export class ModuleStore {
    private readonly api = inject(LicenciamientoApiService);
    private readonly stateSignal = signal<LicenciamientoEstado | null>(null);
    private readonly loadingSignal = signal(false);

    readonly state = this.stateSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly loaded = computed(() => this.stateSignal() !== null);
    readonly enabledModules = computed<ReadonlySet<string>>(() => {
        const status = this.stateSignal();
        const enabled = new Set<string>([MODULE_CODE.CORE]);
        status?.modulos.filter(module => module.habilitado).forEach(module => enabled.add(module.codigo.trim().toUpperCase()));
        return enabled;
    });

    async load(force = false): Promise<LicenciamientoEstado> {
        const cached = this.stateSignal();
        if (cached && !force) return cached;

        this.loadingSignal.set(true);
        try {
            const status = await firstValueFrom(this.api.getStatus());
            this.stateSignal.set(status);
            return status;
        } finally {
            this.loadingSignal.set(false);
        }
    }

    setStatus(status: LicenciamientoEstado): void {
        this.stateSignal.set(status);
    }

    invalidate(): void {
        this.stateSignal.set(null);
    }

    isEnabled(moduleCode: ModuleCode | string): boolean {
        const code = moduleCode.trim().toUpperCase();
        return code === MODULE_CODE.CORE || this.enabledModules().has(code);
    }

    hasAll(moduleCodes: readonly (ModuleCode | string)[]): boolean {
        return moduleCodes.every(code => this.isEnabled(code));
    }
}
