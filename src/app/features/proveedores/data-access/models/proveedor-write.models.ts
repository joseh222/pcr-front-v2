export interface ProveedorCreateRequest {
    idTipoDocumento: number | null;
    numeroDocumento: string | null;
    razonSocial: string;
    nombreComercial: string | null;
    telefono: string | null;
    email: string | null;
    direccion: string | null;
    observaciones: string | null;
}

export interface ProveedorUpdateRequest extends ProveedorCreateRequest {
    rowVersion: string;
}

export interface ProveedorWriteResponse {
    idProveedor: number;
    codProveedor: string;
    rowVersion: string;
    mensaje: string;
}

export interface ProveedorChangeStatusRequest {
    isActive: boolean;
    rowVersion: string;
}

export interface ProveedorChangeStatusResponse {
    idProveedor: number;
    isActive: boolean;
    rowVersion: string;
    mensaje: string;
}
