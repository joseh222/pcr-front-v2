import { VentaTipoItem } from './venta-write.models';

export interface VentaFormItem {
    readonly key: string;
    readonly tipoItem: VentaTipoItem;
    readonly idProducto: number | null;
    readonly idSolicitudServicio: number | null;
    readonly codigo: string;
    readonly referencia: string | null;
    readonly descripcion: string;
    readonly solicitante: string | null;
    readonly cantidad: number;
    readonly precioUnitario: number;
    readonly stockActual: number | null;
    readonly subtotal: number;
    readonly cantidadError: string | null;
}