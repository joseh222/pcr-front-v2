import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from './footer';

describe('Footer', () => {
    let fixture: ComponentFixture<Footer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Footer] }).compileComponents();
        fixture = TestBed.createComponent(Footer);
        fixture.detectChanges();
    });

    it('should display the parish footer', () => {
        expect(fixture.nativeElement.textContent).toContain('Parroquia Cristo Rey');
        expect(fixture.nativeElement.textContent).toContain('Sistema de Gestión Parroquial');
    });
});
