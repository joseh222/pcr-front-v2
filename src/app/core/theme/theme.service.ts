import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ResolvedTheme, ThemePreference } from './theme.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {

    private readonly storageKey = 'pcr-theme-preference';
    private readonly document = inject(DOCUMENT);
    private readonly destroyRef = inject(DestroyRef);

    /*
     * IMPORTANTE:
     *
     * No usamos directamente:
     *
     * localStorage
     *
     * porque el código también se ejecuta durante pruebas
     * dentro de Node.
     *
     * El storage que nos interesa es el del navegador
     * asociado al Document.
     */
    private get storage(): Storage | null {

        try {

            return this.document.defaultView?.localStorage ?? null;
        }
        catch {
            return null;
        }
    }

    private readonly mediaQuery = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)') ?? null;
    private readonly preferenceSignal = signal<ThemePreference>(this.readStoredPreference());
    private readonly systemThemeSignal = signal<ResolvedTheme>(this.mediaQuery?.matches ? 'dark' : 'light');
    readonly preference = this.preferenceSignal.asReadonly();
    readonly systemTheme = this.systemThemeSignal.asReadonly();
    readonly resolvedTheme = computed<ResolvedTheme>(() => {
        const preference = this.preferenceSignal();
        if (preference === 'system') {
            return this.systemThemeSignal();
        }
        return preference;
    });

    private readonly systemThemeListener = (event: MediaQueryListEvent): void => {
        this.systemThemeSignal.set(event.matches ? 'dark' : 'light');
        if (this.preferenceSignal() === 'system') {
            this.applyTheme();
        }
    };


    constructor() {

        this.mediaQuery?.addEventListener(
            'change',
            this.systemThemeListener
        );


        this.destroyRef.onDestroy(() => {

            this.mediaQuery?.removeEventListener(
                'change',
                this.systemThemeListener
            );

        });


        this.applyTheme();
    }

    setPreference(preference: ThemePreference): void {
        this.preferenceSignal.set(preference);
        this.persistPreference(preference);
        this.applyTheme();
    }

    private applyTheme(): void {
        const theme = this.resolvedTheme();
        this.document.documentElement.setAttribute('data-theme', theme);
    }

    private readStoredPreference(): ThemePreference {
        const value = this.storage?.getItem(this.storageKey);
        if (value === 'light' || value === 'dark' || value === 'system') {
            return value;
        }
        return 'system';
    }

    private persistPreference(preference: ThemePreference): void {
        this.storage?.setItem(this.storageKey, preference);
    }
}