export interface MisaModalidad {
    readonly idModalidad: number;
    readonly nombre: string | null;
}

export interface MisaTipo {
    readonly idTipo: number;
    readonly codigo: string;
    readonly nombre: string | null;
}

export interface MisaSanto {
    readonly idSanto: number;
    readonly nombre: string | null;
}

export interface MisaEstado {
    readonly idEstado: number;
    readonly categoria: string | null;
    readonly nombre: string | null;
}

export interface MisaPrecioCalculo {
    readonly idTipo: number;
    readonly codigoTipo: string;
    readonly nombreTipo: string;
    readonly idModalidad: number;
    readonly nombreModalidad: string;
    readonly modoCalculo: string;
    readonly precioBase: number;
    readonly fechaVigencia: string | null;
}