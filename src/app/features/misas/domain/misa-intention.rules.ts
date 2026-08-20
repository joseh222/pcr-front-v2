export const MISA_MODALIDAD_ID = { PERSONAL: 1, COMUNITARIA: 2 } as const;
export const MISA_TIPO_CODE = { SALUD: 'SALUD', DIFUNTO: 'DIFUNTO', ACCION_GRACIAS: 'ACCION_GRACIAS', MATRIMONIO: 'MATRIMONIO' } as const;

export interface MisaIntentionRule {
    readonly showIntentions: boolean;
    readonly min: number;
    readonly max: number | null;
    readonly showObservation: boolean;
    readonly showMotivo: boolean;
    readonly showSanto: boolean;
    readonly showOfrecen: boolean;
    readonly showCelular: boolean;
    readonly showDevotos: boolean;
}

export const EMPTY_MISA_INTENTION_RULE: MisaIntentionRule = {
    showIntentions: false, min: 0, max: 0, showObservation: false,
    showMotivo: false, showSanto: false, showOfrecen: false, showCelular: false, showDevotos: false
};

export function resolveMisaIntentionRule(idModalidad: number | null, codigoTipo: string | null): MisaIntentionRule {
    if (!idModalidad || !codigoTipo) return EMPTY_MISA_INTENTION_RULE;

    const personal = idModalidad === MISA_MODALIDAD_ID.PERSONAL;
    const comunitario = idModalidad === MISA_MODALIDAD_ID.COMUNITARIA;

    if (codigoTipo === MISA_TIPO_CODE.ACCION_GRACIAS) {
        return {
            showIntentions: false, min: 0, max: 0, showObservation: false,
            showMotivo: true, showSanto: true,
            showOfrecen: personal, showCelular: personal, showDevotos: comunitario
        };
    }

    if (codigoTipo === MISA_TIPO_CODE.MATRIMONIO) {
        return {
            showIntentions: true, min: 2, max: 2, showObservation: false,
            showMotivo: true, showSanto: false,
            showOfrecen: personal, showCelular: personal, showDevotos: false
        };
    }

    if (personal) {
        return {
            showIntentions: true, min: 1, max: 1, showObservation: false,
            showMotivo: true, showSanto: false,
            showOfrecen: true, showCelular: true, showDevotos: false
        };
    }

    return {
        showIntentions: true, min: 1, max: null,
        showObservation: codigoTipo === MISA_TIPO_CODE.SALUD || codigoTipo === MISA_TIPO_CODE.DIFUNTO,
        showMotivo: false, showSanto: false, showOfrecen: false, showCelular: false, showDevotos: false
    };
}