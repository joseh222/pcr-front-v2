export interface ProductoCreateRequest {
    readonly idCategoriaProducto: number;
    readonly idMarcaProducto: number | null;
    readonly nombre: string;
    readonly sku: string | null;
    readonly descripcion: string | null;
    readonly precioCompra: number | null;
    readonly precioVenta: number;
}

export interface ProductoUpdateRequest extends ProductoCreateRequest {
    readonly rowVersion: string;
}

export interface ProductoWriteResponse {
    readonly idProducto: number;
    readonly codProducto: string;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface ProductoChangeStatusRequest {
    readonly isActive: boolean;
    readonly rowVersion: string;
}

export interface ProductoChangeStatusResponse {
    readonly idProducto: number;
    readonly isActive: boolean;
    readonly rowVersion: string;
    readonly mensaje: string;
}
