export interface ReporteComprasFilters { fechaInicio: string; fechaFin: string; }
export interface ReporteComprasProveedorItem { idProveedor: number; nombreProveedor: string; cantidadCompras: number; total: number; }
export interface ReporteComprasDiaItem { fecha: string; cantidadCompras: number; total: number; }
export interface ReporteComprasProductoItem { idProducto: number; codigoProducto: string; descripcionProducto: string; cantidad: number; total: number; }
export interface ReporteComprasResponse {
    fechaInicio: string;
    fechaFin: string;
    cantidadCompras: number;
    totalComprado: number;
    compraPromedio: number;
    cantidadAnuladas: number;
    totalAnulado: number;
    proveedores: ReporteComprasProveedorItem[];
    tendenciaDiaria: ReporteComprasDiaItem[];
    productos: ReporteComprasProductoItem[];
}
