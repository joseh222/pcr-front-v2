import { Injectable, computed, inject, signal } from '@angular/core';
import { getApiErrorMessage } from '../../../../core/feedback/api-error-message';
import { RolApiService } from '../rol-api.service';
import { RolListFilters, RolListItem } from './rol-api.models';

@Injectable()
export class RolListStore {
    private readonly api = inject(RolApiService); private readonly rolesSignal = signal<readonly RolListItem[]>([]); private readonly filtersSignal = signal<RolListFilters>({ search: null, isActive: null }); private readonly loadingSignal = signal(false); private readonly errorSignal = signal<string | null>(null);
    readonly loading = this.loadingSignal.asReadonly(); readonly error = this.errorSignal.asReadonly(); readonly items = computed(() => {
        const search = this.filtersSignal().search?.trim().toLowerCase() || ''; const isActive = this.filtersSignal().isActive;
        return this.rolesSignal().filter(role => (isActive == null || role.isActive === isActive) && (!search || `${role.code} ${role.name} ${role.description ?? ''}`.toLowerCase().includes(search)));
    });
    readonly totalRecords = computed(() => this.rolesSignal().length); readonly visibleRecords = computed(() => this.items().length); readonly isEmpty = computed(() => !this.loading() && !this.error() && this.items().length === 0);

    load(): void {
        if (this.loadingSignal()) return; this.loadingSignal.set(true); this.errorSignal.set(null);
        this.api.getRoles(false).subscribe({ next: roles => { this.rolesSignal.set(roles); this.loadingSignal.set(false); }, error: error => { this.loadingSignal.set(false); this.errorSignal.set(getApiErrorMessage(error, 'No se pudieron cargar los roles.')); } });
    }
    reload(): void { this.load(); }
    search(filters: RolListFilters): void { this.filtersSignal.set({ search: filters.search?.trim() || null, isActive: filters.isActive ?? null }); }
    resetFilters(): void { this.filtersSignal.set({ search: null, isActive: null }); }
}
