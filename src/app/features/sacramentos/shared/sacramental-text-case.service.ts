import { Injectable, Injector, inject, signal } from '@angular/core';
import { ConfiguracionApiService } from '../../configuracion/data-access/configuracion-api.service';

@Injectable({ providedIn: 'root' })
export class SacramentalTextCaseService {
    private readonly injector = inject(Injector);
    private readonly loaded = signal(false);
    private readonly loading = signal(false);
    readonly forzarMayusculas = signal(true);

    ensureLoaded(): void {
        if (this.loaded() || this.loading()) return;
        this.loading.set(true);
        try {
            this.injector.get(ConfiguracionApiService).getSacramental().subscribe({
                next: config => { this.forzarMayusculas.set(config.forzarMayusculas); this.loaded.set(true); this.loading.set(false); },
                error: () => this.useSafeDefault()
            });
        } catch { this.useSafeDefault(); }
    }

    setForzarMayusculas(value: boolean): void { this.forzarMayusculas.set(value); this.loaded.set(true); this.loading.set(false); }
    private useSafeDefault(): void { this.forzarMayusculas.set(true); this.loaded.set(true); this.loading.set(false); }
}
