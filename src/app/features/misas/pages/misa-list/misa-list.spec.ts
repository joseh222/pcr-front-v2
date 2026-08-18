import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisaListPage } from './misa-list';

describe('MisaListPage', () => {
    let fixture: ComponentFixture<MisaListPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MisaListPage]
        }).compileComponents();

        fixture = TestBed.createComponent(MisaListPage);
        fixture.detectChanges();
    });

    it('should render the misas page', () => {
        expect(
            fixture.nativeElement.querySelector('[data-testid="misa-list-page"]')
        ).toBeTruthy();

        expect(fixture.nativeElement.textContent).toContain('Misas');
        expect(fixture.nativeElement.textContent).toContain(
            'Gestión de misas e intenciones parroquiales.'
        );
    });
});