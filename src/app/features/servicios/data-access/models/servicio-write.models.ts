import { ServicioModoPrecio } from './servicio-catalog.models';

export interface ServicioCreateRequest {
    readonly codigo: string;
    readonly idCategoriaServicio: number;
    readonly nombre: string;
    readonly descripcion: string | null;
    readonly modoPrecio: ServicioModoPrecio;
    readonly precioBase: number | null;
}

export interface ServicioUpdateRequest {
    readonly idCategoriaServicio: number;
    readonly nombre: string;
    readonly descripcion: string | null;
    readonly modoPrecio: ServicioModoPrecio;
    readonly precioBase: number | null;
    readonly rowVersion: string;
}

export interface ServicioWriteResponse {
    readonly idServicio: number;
    readonly codigo: string;
    readonly rowVersion: string;
    readonly mensaje: string;
}

export interface ServicioChangeStatusRequest {
    readonly isActive: boolean;
    readonly rowVersion: string;
}

export interface ServicioChangeStatusResponse {
    readonly idServicio: number;
    readonly isActive: boolean;
    readonly rowVersion: string;
    readonly mensaje: string;
}
