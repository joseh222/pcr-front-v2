export interface ProveedorTipoDocumento {
    idTipoDocumento: number;
    codigo: string;
    nombre: string;
    longitudMinima: number | null;
    longitudMaxima: number | null;
    soloNumeros: boolean;
    isActive: boolean;
}
