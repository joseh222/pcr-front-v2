export type ServicioModoPrecio = 'FIJO' | 'VARIABLE';
export interface CategoriaServicio { readonly idCategoriaServicio:number; readonly codigo:string; readonly nombre:string; readonly descripcion:string|null; readonly isActive:boolean; readonly rowVersion:string; }
export interface TipoSacramentoServicio { readonly idTipoSacramento:number; readonly codigo:'BAUTISMO'|'CONFIRMACION'|'MATRIMONIO'|string; readonly nombre:string; readonly orden:number; }
