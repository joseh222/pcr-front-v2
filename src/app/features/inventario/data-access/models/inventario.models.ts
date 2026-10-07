export type InventarioNaturaleza = 'E' | 'S';

export interface TipoMovimientoInventario {
    readonly idTipoMovimiento: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly naturaleza: InventarioNaturaleza;
    readonly permiteRegistroManual: boolean;
}

export interface InventarioProducto {
    readonly idProducto: number;
    readonly codProducto: string;
    readonly nombre: string;
    readonly sku: string | null;
    readonly idCategoriaProducto: number;
    readonly nombreCategoria: string;
    readonly idMarcaProducto: number | null;
    readonly nombreMarca: string | null;
    readonly precioCompra: number | null;
    readonly precioVenta: number;
    readonly isActive: boolean;
    readonly stockActual: number;
    readonly updatedUtc: string | null;
    readonly updatedById: number | null;
    readonly stockRowVersion: string;
    readonly fechaUltimoMovimiento: string | null;
}

export interface MovimientoInventarioCreateRequest {
    readonly idTipoMovimiento: number;
    readonly cantidad: number;
    readonly costoUnitario: number | null;
    readonly motivo: string | null;
}

export interface MovimientoInventarioCreateResponse {
    readonly idMovimiento: number;
    readonly idProducto: number;
    readonly idTipoMovimiento: number;
    readonly codigoTipoMovimiento: string;
    readonly nombreTipoMovimiento: string;
    readonly naturaleza: InventarioNaturaleza;
    readonly cantidad: number;
    readonly stockAnterior: number;
    readonly stockNuevo: number;
    readonly costoUnitario: number | null;
    readonly motivo: string | null;
    readonly createdUtc: string;
    readonly stockRowVersion: string;
    readonly mensaje: string;
}

export interface MovimientoInventarioListFilters {
    readonly idProducto: number | null;
    readonly idTipoMovimiento: number | null;
    readonly fechaInicio: string | null;
    readonly fechaFin: string | null;
}

export interface MovimientoInventarioListQuery extends MovimientoInventarioListFilters {
    readonly pageNumber: number;
    readonly pageSize: number;
}

export interface MovimientoInventarioListItem {
    readonly idMovimiento: number;
    readonly idProducto: number;
    readonly codProducto: string;
    readonly nombreProducto: string;
    readonly sku: string | null;
    readonly idTipoMovimiento: number;
    readonly codigoTipoMovimiento: string;
    readonly nombreTipoMovimiento: string;
    readonly naturaleza: InventarioNaturaleza;
    readonly cantidad: number;
    readonly stockAnterior: number;
    readonly stockNuevo: number;
    readonly costoUnitario: number | null;
    readonly motivo: string | null;
    readonly createdUtc: string;
    readonly createdById: number | null;
}

export interface MovimientoInventarioPagedResponse {
    readonly items: readonly MovimientoInventarioListItem[];
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly totalRecords: number;
    readonly totalPages: number;
}
