export const MISA_MODALIDAD_ID = { PERSONAL: 1, COMUNITARIA: 2 } as const;
export const MISA_TIPO_CODE = { SALUD: 'SALUD', DIFUNTO: 'DIFUNTO', ACCION_GRACIAS: 'ACCION_GRACIAS', MATRIMONIO: 'MATRIMONIO' } as const;

export interface MisaIntentionRule { readonly min: number; readonly max: number | null; readonly showObservation: boolean; }

export const EMPTY_MISA_INTENTION_RULE: MisaIntentionRule = { min: 0, max: 0, showObservation: false };

export function resolveMisaIntentionRule(idModalidad: number | null, codigoTipo: string | null): MisaIntentionRule {
    if (!idModalidad || !codigoTipo)
        return EMPTY_MISA_INTENTION_RULE;
    if (codigoTipo === MISA_TIPO_CODE.MATRIMONIO)
        return { min: 2, max: 2, showObservation: idModalidad === MISA_MODALIDAD_ID.COMUNITARIA };
    if (idModalidad === MISA_MODALIDAD_ID.PERSONAL)
        return { min: 1, max: 1, showObservation: false };
    return { min: 1, max: null, showObservation: true };
}