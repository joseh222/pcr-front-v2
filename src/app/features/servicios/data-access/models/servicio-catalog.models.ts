export type ServicioModoPrecio = 'FIJO' | 'VARIABLE';

export interface CategoriaServicio {
    readonly idCategoriaServicio: number;
    readonly codigo: string;
    readonly nombre: string;
    readonly descripcion: string | null;
    readonly isActive: boolean;
    readonly rowVersion: string;
}
