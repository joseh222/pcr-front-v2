import { MISA_MODALIDAD_ID, resolveMisaIntentionRule } from './misa-intention.rules';

describe('Misa intention rules', () => {
    it('should require one intention for a personal non-marriage misa', () => {
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.PERSONAL, 'DIFUNTO')).toEqual({ min: 1, max: 1, showObservation: false });
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.PERSONAL, 'SALUD')).toEqual({ min: 1, max: 1, showObservation: false });
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.PERSONAL, 'ACCION_GRACIAS')).toEqual({ min: 1, max: 1, showObservation: false });
    });

    it('should require exactly two intentions for marriage', () => {
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.PERSONAL, 'MATRIMONIO')).toEqual({ min: 2, max: 2, showObservation: false });
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.COMUNITARIA, 'MATRIMONIO')).toEqual({ min: 2, max: 2, showObservation: true });
    });

    it('should allow multiple intentions for community misas', () => {
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.COMUNITARIA, 'SALUD')).toEqual({ min: 1, max: null, showObservation: true });
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.COMUNITARIA, 'DIFUNTO')).toEqual({ min: 1, max: null, showObservation: true });
    });

    it('should not require intentions until modality and type are selected', () => {
        expect(resolveMisaIntentionRule(null, null)).toEqual({ min: 0, max: 0, showObservation: false });
    });
});