export interface ProductoListFilters {
    readonly search: string | null;
    readonly idCategoriaProducto: number | null;
    readonly idMarcaProducto: number | null;
    readonly isActive: boolean | null;
}

export interface ProductoListQuery extends ProductoListFilters {
    readonly pageNumber: number;
    readonly pageSize: number;
}

export interface ProductoListItem {
    readonly idProducto: number;
    readonly codProducto: string;
    readonly idCategoriaProducto: number;
    readonly codigoCategoria: string;
    readonly nombreCategoria: string;
    readonly idMarcaProducto: number | null;
    readonly codigoMarca: string | null;
    readonly nombreMarca: string | null;
    readonly nombre: string;
    readonly sku: string | null;
    readonly descripcion: string | null;
    readonly precioCompra: number | null;
    readonly precioVenta: number;
    readonly stockActual: number;
    readonly isActive: boolean;
    readonly rowVersion: string;
}

export interface ProductoPagedResponse {
    readonly items: readonly ProductoListItem[];
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly totalRecords: number;
    readonly totalPages: number;
}

export interface ProductoDetail {
    readonly idProducto: number;
    readonly codProducto: string;
    readonly idCategoriaProducto: number;
    readonly codigoCategoria: string;
    readonly nombreCategoria: string;
    readonly idMarcaProducto: number | null;
    readonly codigoMarca: string | null;
    readonly nombreMarca: string | null;
    readonly nombre: string;
    readonly sku: string | null;
    readonly descripcion: string | null;
    readonly precioCompra: number | null;
    readonly precioVenta: number;
    readonly stockActual: number;
    readonly isActive: boolean;
    readonly createdUtc: string;
    readonly updatedUtc: string | null;
    readonly createdById: number | null;
    readonly updatedById: number | null;
    readonly rowVersion: string;
    readonly stockRowVersion: string;
}


export interface ProductoSearchItem {
    readonly idProducto: number;
    readonly codProducto: string;
    readonly nombre: string;
    readonly sku: string | null;
    readonly idCategoriaProducto: number;
    readonly nombreCategoria: string;
    readonly idMarcaProducto: number | null;
    readonly nombreMarca: string | null;
    readonly precioVenta: number;
    readonly stockActual: number;
}
