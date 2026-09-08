import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscripcionesHomePage } from './inscripciones-home';

describe('InscripcionesHomePage', () => {
    let fixture: ComponentFixture<InscripcionesHomePage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [InscripcionesHomePage] }).compileComponents();
        fixture = TestBed.createComponent(InscripcionesHomePage);
        fixture.detectChanges();
    });

    it('should show the module as coming soon', () => {
        expect(fixture.nativeElement.querySelector('[data-testid="inscripciones-coming-soon"]')).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('Módulo de Inscripciones');
        expect(fixture.nativeElement.textContent).toContain('Próximamente');
    });
});
