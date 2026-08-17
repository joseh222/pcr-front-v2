import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { vi } from 'vitest';

import { App } from './app';
import { ThemePreference } from './core/theme/theme.model';
import { ThemeService } from './core/theme/theme.service';

describe('App', () => {
  const preference = signal<ThemePreference>('system');
  const resolvedTheme = signal<'light' | 'dark'>('light');

  const themeServiceMock = {
    preference: preference.asReadonly(),
    resolvedTheme: resolvedTheme.asReadonly(),
    setPreference: vi.fn((value: ThemePreference) => {
      preference.set(value);

      if (value !== 'system') {
        resolvedTheme.set(value);
      }
    })
  };

  beforeEach(async () => {
    preference.set('system');
    resolvedTheme.set('light');
    themeServiceMock.setPreference.mockClear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: ThemeService,
          useValue: themeServiceMock
        }
      ]
    }).compileComponents();
  });

  it('should create the application', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the application title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('PCR Front V2');
    expect(element.textContent).toContain('PCR Design System');
  });

  it('should render the theme controls with Angular Material', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    const buttonTexts = await Promise.all(buttons.map(button => button.getText()));

    expect(buttonTexts).toContain('Claro');
    expect(buttonTexts).toContain('Oscuro');
    expect(buttonTexts).toContain('Sistema');
  });

  it('should request the dark theme when the dark button is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const darkButton = await loader.getHarness(MatButtonHarness.with({ text: 'Oscuro' }));

    await darkButton.click();

    expect(themeServiceMock.setPreference).toHaveBeenCalledWith('dark');
  });
});