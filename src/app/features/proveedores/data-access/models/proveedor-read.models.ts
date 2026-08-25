export interface ProveedorListFilters {
    search: string | null;
    idTipoDocumento: number | null;
    isActive: boolean | null;
}

export interface ProveedorListQuery extends ProveedorListFilters {
    pageNumber: number;
    pageSize: number;
}

export interface ProveedorListItem {
    idProveedor: number;
    codProveedor: string;
    idTipoDocumento: number | null;
    codigoTipoDocumento: string | null;
    nombreTipoDocumento: string | null;
    numeroDocumento: string | null;
    razonSocial: string;
    nombreComercial: string | null;
    telefono: string | null;
    email: string | null;
    direccion: string | null;
    observaciones: string | null;
    isActive: boolean;
    createdUtc: string;
    updatedUtc: string | null;
    rowVersion: string;
}

export interface ProveedorPagedResponse {
    items: readonly ProveedorListItem[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}

export interface ProveedorDetail extends ProveedorListItem {
    createdById: number | null;
    updatedById: number | null;
}

export interface ProveedorSearchItem {
    idProveedor: number;
    codProveedor: string;
    idTipoDocumento: number | null;
    codigoTipoDocumento: string | null;
    numeroDocumento: string | null;
    razonSocial: string;
    nombreComercial: string | null;
    telefono: string | null;
    email: string | null;
    isActive: boolean;
}
