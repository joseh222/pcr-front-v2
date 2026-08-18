import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppShell } from './app-shell';

describe('AppShell', () => {
    let fixture: ComponentFixture<AppShell>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppShell],
            providers: [provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(AppShell);
        fixture.detectChanges();
    });

    it('should render the componentized application layout', () => {
        expect(fixture.nativeElement.querySelector('pcr-sidebar')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('pcr-topbar')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-testid="app-main"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('pcr-footer')).toBeTruthy();
    });

    it('should open and close the mobile sidebar', () => {
        const toggle = fixture.nativeElement.querySelector('[data-testid="mobile-sidebar-toggle"]') as HTMLButtonElement;

        toggle.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="app-sidebar"]')
            .classList.contains('app-sidebar-open')).toBe(true);

        const backdrop = fixture.nativeElement.querySelector('[data-testid="sidebar-backdrop"]') as HTMLButtonElement;
        backdrop.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="app-sidebar"]')
            .classList.contains('app-sidebar-open')).toBe(false);
    });

    it('should collapse and restore the desktop sidebar', () => {
        const toggle = fixture.nativeElement.querySelector('[data-testid="desktop-sidebar-toggle"]') as HTMLButtonElement;

        toggle.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="app-shell"]')
            .classList.contains('app-layout-sidebar-collapsed')).toBe(true);

        toggle.click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-testid="app-shell"]')
            .classList.contains('app-layout-sidebar-collapsed')).toBe(false);
    });
});
