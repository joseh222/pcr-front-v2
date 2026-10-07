import {
    MisaEstado,
    MisaModalidad,
    MisaSanto,
    MisaTipo
} from './misa-catalog.models';

export interface MisaListQuery {
    readonly fechaInicio?: string | null;
    readonly fechaFin?: string | null;
    readonly idModalidad?: number | null;
    readonly idTipo?: number | null;
    readonly idEstado?: number | null;
    readonly estadoPago?: string | null;
    readonly texto?: string | null;
    readonly pagina: number;
    readonly tamanoPagina: number;
}

export type MisaListFilters = Omit<
    MisaListQuery,
    'pagina' | 'tamanoPagina'
>;

export interface MisaSolicitante {
    readonly idSolicitante: number;
    readonly idPersona: number | null;
    readonly idTipoDocumento: number | null;
    readonly codigoTipoDocumento: string | null;
    readonly nombreTipoDocumento: string | null;
    readonly numeroDocumento: string | null;
    readonly nombre: string | null;
    readonly telefono: string | null;
}

export interface MisaSolicitudServicio {
    readonly idSolicitudServicio: number;
    readonly codSolicitudServicio: string;
    readonly requierePago: boolean;
    readonly importe: number;
    readonly motivoNoPago: string | null;
    readonly estadoSolicitud: string;
    readonly estadoPago: string;
}

export interface MisaIntencion {
    readonly idIntencion: number;
    readonly nombre: string | null;
    readonly observacion: string | null;
}

export interface MisaListItem {
    readonly idMisa: number;
    readonly codMisa: string | null;

    readonly fecha: string | null;
    readonly hora: string | null;
    readonly fechaHora: string | null;

    readonly observaciones: string | null;

    readonly modalidad: MisaModalidad | null;
    readonly tipo: MisaTipo | null;
    readonly solicitante: MisaSolicitante | null;
    readonly estado: MisaEstado | null;
    readonly solicitudServicio: MisaSolicitudServicio | null;

    readonly cantidadIntenciones: number;

    readonly puedeEditar: boolean;
    readonly puedeEliminar: boolean;
    readonly puedeCobrar: boolean;
}

export interface MisaPagedResponse {
    readonly pagina: number;
    readonly tamanoPagina: number;
    readonly totalRegistros: number;
    readonly totalPaginas: number;
    readonly items: readonly MisaListItem[];
}

export interface MisaDetail {
    readonly idMisa: number;
    readonly codMisa: string | null;

    readonly modalidad: MisaModalidad | null;
    readonly tipo: MisaTipo | null;
    readonly solicitante: MisaSolicitante | null;
    readonly estado: MisaEstado | null;
    readonly santo: MisaSanto | null;

    readonly intenciones: readonly MisaIntencion[];

    readonly fecha: string | null;
    readonly hora: string | null;
    readonly fechaHora: string | null;

    readonly observaciones: string | null;
    readonly motivo: string | null;
    readonly ofrecen: string | null;
    readonly celular: string | null;
    readonly devotos: string | null;

    readonly solicitudServicio: MisaSolicitudServicio | null;

    readonly puedeEditar: boolean;
    readonly puedeEliminar: boolean;
    readonly puedeCobrar: boolean;
}