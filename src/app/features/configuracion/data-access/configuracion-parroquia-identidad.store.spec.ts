import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ConfiguracionApiService } from './configuracion-api.service';
import { ConfiguracionParroquiaIdentidadStore } from './configuracion-parroquia-identidad.store';

describe('ConfiguracionParroquiaIdentidadStore', () => {
    it('expone el nombre configurado de la parroquia', async () => {
        TestBed.configureTestingModule({ providers: [{ provide: ConfiguracionApiService, useValue: { getIdentidadParroquia: () => of({ nombreParroquia: 'Parroquia San José', lugarExpedicion: null, direccion: null, distrito: null, provincia: null, departamento: null, telefono: null, ruc: null, configuracionInicialCompletada: true }) } }] });
        const store = TestBed.inject(ConfiguracionParroquiaIdentidadStore);
        await store.load();
        expect(store.nombreParroquia()).toBe('Parroquia San José');
    });
});
