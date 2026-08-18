import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidebar } from './sidebar';

describe('Sidebar', () => {
    let fixture: ComponentFixture<Sidebar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Sidebar] }).compileComponents();
        fixture = TestBed.createComponent(Sidebar);
        fixture.detectChanges();
    });

    it('should render the parish navigation', () => {
        expect(fixture.nativeElement.textContent).toContain('PCR');
        expect(fixture.nativeElement.textContent).toContain('Inicio');
    });

    it('should reflect open and collapsed states', () => {
        fixture.componentRef.setInput('open', true);
        fixture.componentRef.setInput('collapsed', true);
        fixture.detectChanges();

        const sidebar = fixture.nativeElement.querySelector('[data-testid="app-sidebar"]');
        expect(sidebar.classList.contains('app-sidebar-open')).toBe(true);
        expect(sidebar.classList.contains('app-sidebar-collapsed')).toBe(true);
    });
});
