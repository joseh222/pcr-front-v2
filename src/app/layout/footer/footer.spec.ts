import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from './footer';
import { ConfiguracionParroquiaIdentidadStore } from '../../features/configuracion/data-access/configuracion-parroquia-identidad.store';

describe('Footer', () => {
    let fixture: ComponentFixture<Footer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Footer], providers: [{ provide: ConfiguracionParroquiaIdentidadStore, useValue: { nombreParroquia: () => 'Parroquia Demo' } }] }).compileComponents();
        fixture = TestBed.createComponent(Footer);
        fixture.detectChanges();
    });

    it('should display the parish footer', () => {
        expect(fixture.nativeElement.textContent).toContain('Parroquia Demo');
        expect(fixture.nativeElement.textContent).toContain('Sistema de Gestión Parroquial');
    });
});
