export interface CompraFormItem {
    readonly idProducto: number;
    readonly codProducto: string;
    readonly nombre: string;
    readonly sku: string | null;
    readonly cantidad: number;
    readonly costoUnitario: number;
    readonly subtotal: number;
    readonly cantidadError: string | null;
    readonly costoError: string | null;
}

export type CompraAddProductResult = 'ADDED' | 'DUPLICATE' | 'LIMIT';
