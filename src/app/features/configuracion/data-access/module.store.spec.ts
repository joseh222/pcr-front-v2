import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { MODULE_CODE } from '../../../core/licensing/module-code.model';
import { LicenciamientoApiService } from './licenciamiento-api.service';
import { ModuleStore } from './module.store';

describe('ModuleStore', () => {
    it('treats CORE as enabled and respects the signed status returned by the Back', async () => {
        TestBed.configureTestingModule({
            providers: [{
                provide: LicenciamientoApiService,
                useValue: {
                    getStatus: () => of({
                        productCode: 'PCR', installationId: '1', installationCode: 'PCR-1', parishName: 'Demo', estado: 'ACTIVA',
                        licenciamientoConfigurado: true, licenciaValida: true, licenseId: '1', customerName: 'Demo', licenseType: 'PERPETUAL',
                        keyId: 'K', issuedAtUtc: null, expiresAtUtc: null, activatedAtUtc: null, activatedBy: null, mensaje: 'OK',
                        modulos: [
                            { codigo: 'CORE', nombre: 'Core', descripcion: null, esCore: true, habilitado: true, dependencias: [] },
                            { codigo: 'VENTAS', nombre: 'Ventas', descripcion: null, esCore: false, habilitado: true, dependencias: [] },
                            { codigo: 'COMPRAS', nombre: 'Compras', descripcion: null, esCore: false, habilitado: false, dependencias: [] }
                        ]
                    })
                }
            }]
        });
        const store = TestBed.inject(ModuleStore);
        await store.load();
        expect(store.isEnabled(MODULE_CODE.CORE)).toBe(true);
        expect(store.isEnabled(MODULE_CODE.SALES)).toBe(true);
        expect(store.isEnabled(MODULE_CODE.PURCHASES)).toBe(false);
    });
});
