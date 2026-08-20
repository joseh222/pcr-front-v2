import { MISA_MODALIDAD_ID, resolveMisaIntentionRule } from './misa-intention.rules';

describe('Misa intention rules', () => {
    it('should configure community health and deceased misas', () => {
        for (const codigo of ['SALUD', 'DIFUNTO']) {
            expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.COMUNITARIA, codigo)).toMatchObject({ showIntentions: true, min: 1, max: null, showObservation: true, showMotivo: false });
        }
    });

    it('should configure community marriage', () => {
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.COMUNITARIA, 'MATRIMONIO')).toMatchObject({ showIntentions: true, min: 2, max: 2, showObservation: false, showMotivo: true });
    });

    it('should configure community thanksgiving', () => {
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.COMUNITARIA, 'ACCION_GRACIAS')).toMatchObject({ showIntentions: false, showObservation: false, showMotivo: true, showSanto: true, showDevotos: true });
    });

    it('should configure personal health and deceased misas', () => {
        for (const codigo of ['SALUD', 'DIFUNTO']) {
            expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.PERSONAL, codigo)).toMatchObject({ showIntentions: true, min: 1, max: 1, showObservation: false, showMotivo: true, showOfrecen: true, showCelular: true });
        }
    });

    it('should configure personal marriage', () => {
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.PERSONAL, 'MATRIMONIO')).toMatchObject({ showIntentions: true, min: 2, max: 2, showObservation: false, showMotivo: true, showOfrecen: true, showCelular: true });
    });

    it('should configure personal thanksgiving', () => {
        expect(resolveMisaIntentionRule(MISA_MODALIDAD_ID.PERSONAL, 'ACCION_GRACIAS')).toMatchObject({ showIntentions: false, showMotivo: true, showSanto: true, showOfrecen: true, showCelular: true, showDevotos: false });
    });
});