export type ServicioModoPrecio = 'FIJO' | 'VARIABLE';

export interface ServicioLookupItem {
    readonly idServicio: number;
    readonly codigo: string;
    readonly idCategoriaServicio: number;
    readonly codigoCategoria: string;
    readonly nombreCategoria: string;
    readonly nombre: string;
    readonly descripcion: string | null;
    readonly modoPrecio: ServicioModoPrecio;
    readonly precioBase: number | null;
}

export interface ServicioListItem extends ServicioLookupItem {
    readonly categoriaIsActive: boolean;
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
