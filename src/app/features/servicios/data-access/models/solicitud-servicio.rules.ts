import { SolicitudServicioListItem } from './solicitud-servicio-read.models';

export function isMisaSolicitud(item: Pick<SolicitudServicioListItem, 'codigoServicio'>): boolean {
    return item.codigoServicio.trim().toUpperCase() === 'MISA';
}

export function canEditSolicitud(item: Pick<SolicitudServicioListItem, 'codigoServicio' | 'estadoSolicitud' | 'estadoPago'>): boolean {
    return !isMisaSolicitud(item) && item.estadoSolicitud === 'ACTIVA' && item.estadoPago !== 'PAGADO';
}

export function canCancelSolicitud(item: Pick<SolicitudServicioListItem, 'codigoServicio' | 'estadoSolicitud' | 'estadoPago'>): boolean {
    return !isMisaSolicitud(item) && item.estadoSolicitud === 'ACTIVA' && item.estadoPago !== 'PAGADO';
}

export function canChargeSolicitud(item: Pick<SolicitudServicioListItem, 'estadoSolicitud' | 'estadoPago' | 'requierePago'>): boolean {
    return item.estadoSolicitud === 'ACTIVA' && item.estadoPago === 'PENDIENTE' && item.requierePago;
}
