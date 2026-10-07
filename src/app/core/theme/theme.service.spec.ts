import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

class MemoryStorage implements Storage {
    private readonly values = new Map<string, string>();

    get length(): number {
        return this.values.size;
    }

    clear(): void {
        this.values.clear();
    }

    getItem(key: string): string | null {
        return this.values.get(key) ?? null;
    }

    key(index: number): string | null {
        return Array.from(this.values.keys())[index] ?? null;
    }

    removeItem(key: string): void {
        this.values.delete(key);
    }

    setItem(key: string, value: string): void {
        this.values.set(key, value);
    }
}

describe('ThemeService', () => {
    let storage: MemoryStorage;
    let rootElement: HTMLElement;

    beforeEach(() => {
        storage = new MemoryStorage();
        rootElement = document.createElement('html');

        const mediaQuery = {
            matches: false,
            media: '(prefers-color-scheme: dark)',
            onchange: null,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            addListener: () => undefined,
            removeListener: () => undefined,
            dispatchEvent: () => true
        } as MediaQueryList;

        const documentMock = {
            documentElement: rootElement,
            defaultView: {
                localStorage: storage,
                matchMedia: () => mediaQuery
            }
        };

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DOCUMENT,
                    useValue: documentMock
                }
            ]
        });
    });

    it('should use system as the default preference', () => {
        const service = TestBed.inject(ThemeService);

        expect(service.preference()).toBe('system');
        expect(service.resolvedTheme()).toBe('light');
        expect(rootElement.getAttribute('data-theme')).toBe('light');
    });

    it('should apply the light theme', () => {
        const service = TestBed.inject(ThemeService);

        service.setPreference('light');

        expect(service.preference()).toBe('light');
        expect(service.resolvedTheme()).toBe('light');
        expect(rootElement.getAttribute('data-theme')).toBe('light');
    });

    it('should apply the dark theme', () => {
        const service = TestBed.inject(ThemeService);

        service.setPreference('dark');

        expect(service.preference()).toBe('dark');
        expect(service.resolvedTheme()).toBe('dark');
        expect(rootElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should persist the selected preference', () => {
        const service = TestBed.inject(ThemeService);

        service.setPreference('dark');

        expect(storage.getItem('pcr-theme-preference')).toBe('dark');
    });
});