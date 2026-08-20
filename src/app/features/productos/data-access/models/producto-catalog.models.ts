export interface ProductoCategoria {
    readonly idCategoriaProducto: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly descripcion: string | null;
    readonly isActive: boolean;
    readonly rowVersion: string;
}

export interface ProductoMarca {
    readonly idMarcaProducto: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly descripcion: string | null;
    readonly isActive: boolean;
    readonly rowVersion: string;
}
