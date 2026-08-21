import { ServicioModoPrecio } from './servicio-catalog.models';

export interface ServicioListFilters {
    readonly search: string | null;
    readonly idCategoriaServicio: number | null;
    readonly modoPrecio: ServicioModoPrecio | null;
    readonly isActive: boolean | null;
}

export interface ServicioListQuery extends ServicioListFilters {
    readonly pageNumber: number;
    readonly pageSize: number;
}

export interface ServicioListItem {
    readonly idServicio: number;
    readonly codigo: string;
    readonly idCategoriaServicio: number;
    readonly codigoCategoria: string;
    readonly nombreCategoria: string;
    readonly categoriaIsActive: boolean;
    readonly nombre: string;
    readonly descripcion: string | null;
    readonly modoPrecio: ServicioModoPrecio;
    readonly precioBase: number | null;
    readonly isActive: boolean;
    readonly rowVersion: string;
}

export interface ServicioPagedResponse {
    readonly items: readonly ServicioListItem[];
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly totalRecords: number;
    readonly totalPages: number;
}

export interface ServicioDetail extends ServicioListItem {
    readonly createdUtc: string;
    readonly updatedUtc: string | null;
    readonly createdById: number | null;
    readonly updatedById: number | null;
}
