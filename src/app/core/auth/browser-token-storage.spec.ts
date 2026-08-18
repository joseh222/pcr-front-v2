import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { BrowserTokenStorage } from './browser-token-storage';

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

describe('BrowserTokenStorage', () => {
    let service: BrowserTokenStorage;
    let storage: MemoryStorage;

    beforeEach(() => {
        storage = new MemoryStorage();

        TestBed.configureTestingModule({
            providers: [
                BrowserTokenStorage,
                {
                    provide: DOCUMENT,
                    useValue: {
                        defaultView: {
                            sessionStorage: storage
                        }
                    }
                }
            ]
        });

        service = TestBed.inject(BrowserTokenStorage);
    });

    it('should return null when tokens are not stored', () => {
        expect(service.getAccessToken()).toBeNull();
        expect(service.getRefreshToken()).toBeNull();
    });

    it('should store and retrieve authentication tokens', () => {
        service.setTokens({
            accessToken: 'access-token-test',
            refreshToken: 'refresh-token-test'
        });

        expect(service.getAccessToken()).toBe('access-token-test');
        expect(service.getRefreshToken()).toBe('refresh-token-test');
    });

    it('should clear authentication tokens', () => {
        service.setTokens({
            accessToken: 'access-token-test',
            refreshToken: 'refresh-token-test'
        });

        service.clear();

        expect(service.getAccessToken()).toBeNull();
        expect(service.getRefreshToken()).toBeNull();
    });
});