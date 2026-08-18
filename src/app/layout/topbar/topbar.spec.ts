import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Topbar } from './topbar';

describe('Topbar', () => {
    let fixture: ComponentFixture<Topbar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [Topbar] }).compileComponents();
        fixture = TestBed.createComponent(Topbar);
        fixture.detectChanges();
    });

    it('should render the application title', () => {
        expect(fixture.nativeElement.textContent).toContain('Sistema de Gestión Parroquial');
        expect(fixture.nativeElement.textContent).toContain('Parroquia Cristo Rey');
    });

    it('should emit mobile menu requests', () => {
        const emitted = vi.fn();
        fixture.componentInstance.mobileMenuRequested.subscribe(emitted);

        (fixture.nativeElement.querySelector('[data-testid="mobile-sidebar-toggle"]') as HTMLButtonElement).click();

        expect(emitted).toHaveBeenCalledTimes(1);
    });

    it('should emit desktop menu requests', () => {
        const emitted = vi.fn();
        fixture.componentInstance.desktopMenuRequested.subscribe(emitted);

        (fixture.nativeElement.querySelector('[data-testid="desktop-sidebar-toggle"]') as HTMLButtonElement).click();

        expect(emitted).toHaveBeenCalledTimes(1);
    });
});
