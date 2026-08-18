import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPage } from './dashboard';

describe('DashboardPage', () => {
    let fixture: ComponentFixture<DashboardPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardPage]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardPage);
        fixture.detectChanges();
    });

    it('should render the dashboard page', () => {
        expect(
            fixture.nativeElement.querySelector('[data-testid="dashboard-page"]')
        ).toBeTruthy();

        expect(fixture.nativeElement.textContent).toContain('Dashboard');
        expect(fixture.nativeElement.textContent).toContain(
            'Bienvenido al Sistema de Gestión Parroquial.'
        );
    });
});