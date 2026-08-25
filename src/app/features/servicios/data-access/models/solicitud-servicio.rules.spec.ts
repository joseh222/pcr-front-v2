import { canCancelSolicitud, canChargeSolicitud, canEditSolicitud, isMisaSolicitud } from './solicitud-servicio.rules';

describe('solicitud-servicio rules', () => {
    it('should keep Misa under its own domain', () => {
        const item = { codigoServicio: 'MISA', estadoSolicitud: 'ACTIVA', estadoPago: 'PENDIENTE', requierePago: true } as any;
        expect(isMisaSolicitud(item)).toBe(true); expect(canEditSolicitud(item)).toBe(false); expect(canCancelSolicitud(item)).toBe(false); expect(canChargeSolicitud(item)).toBe(true);
    });

    it('should allow generic pending request operations', () => {
        const item = { codigoServicio: 'CONSTANCIA', estadoSolicitud: 'ACTIVA', estadoPago: 'PENDIENTE', requierePago: true } as any;
        expect(canEditSolicitud(item)).toBe(true); expect(canCancelSolicitud(item)).toBe(true); expect(canChargeSolicitud(item)).toBe(true);
    });

    it('should block commercial changes after payment', () => {
        const item = { codigoServicio: 'CONSTANCIA', estadoSolicitud: 'ACTIVA', estadoPago: 'PAGADO', requierePago: true } as any;
        expect(canEditSolicitud(item)).toBe(false); expect(canCancelSolicitud(item)).toBe(false); expect(canChargeSolicitud(item)).toBe(false);
    });
});
