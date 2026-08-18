import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ThemePreference } from '../../../core/theme/theme.model';
import { ThemeService } from '../../../core/theme/theme.service';
import { ThemeMenu } from './theme-menu';

describe('ThemeMenu', () => {
    let fixture: ComponentFixture<ThemeMenu>;

    const preference = signal<ThemePreference>('system');
    const resolvedTheme = signal<'light' | 'dark'>('light');

    const themeServiceMock = {
        preference: preference.asReadonly(),
        resolvedTheme: resolvedTheme.asReadonly(),
        setPreference: vi.fn((value: ThemePreference) => preference.set(value))
    };

    beforeEach(async () => {
        preference.set('system');
        resolvedTheme.set('light');
        themeServiceMock.setPreference.mockClear();

        await TestBed.configureTestingModule({
            imports: [ThemeMenu],
            providers: [
                { provide: ThemeService, useValue: themeServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ThemeMenu);
        fixture.detectChanges();
    });

    it('should use the resolved theme icon', () => {
        const trigger = fixture.nativeElement.querySelector('[data-testid="theme-menu-trigger"]');

        expect(trigger?.textContent).toContain('light_mode');

        resolvedTheme.set('dark');
        fixture.detectChanges();

        expect(trigger?.textContent).toContain('dark_mode');
    });

    it('should change the theme preference', () => {
        (fixture.componentInstance as any).setTheme('dark');

        expect(themeServiceMock.setPreference).toHaveBeenCalledWith('dark');
        expect(preference()).toBe('dark');
    });

    it('should support system theme preference', () => {
        (fixture.componentInstance as any).setTheme('system');

        expect(themeServiceMock.setPreference).toHaveBeenCalledWith('system');
    });
});