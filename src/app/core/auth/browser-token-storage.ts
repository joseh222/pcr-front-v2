import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { AuthTokens } from './auth-tokens.model';
import { TokenStorage } from './token-storage';

@Injectable()
export class BrowserTokenStorage implements TokenStorage {
    private readonly document = inject(DOCUMENT);
    private readonly accessTokenKey = 'pcr-auth-access-token';
    private readonly refreshTokenKey = 'pcr-auth-refresh-token';

    getAccessToken(): string | null {
        return this.storage?.getItem(this.accessTokenKey) ?? null;
    }

    getRefreshToken(): string | null {
        return this.storage?.getItem(this.refreshTokenKey) ?? null;
    }

    setTokens(tokens: AuthTokens): void {
        const storage = this.storage;

        if (!storage) {
            throw new Error('Browser session storage is not available.');
        }

        storage.setItem(this.accessTokenKey, tokens.accessToken);
        storage.setItem(this.refreshTokenKey, tokens.refreshToken);
    }

    clear(): void {
        const storage = this.storage;

        if (!storage) {
            return;
        }

        storage.removeItem(this.accessTokenKey);
        storage.removeItem(this.refreshTokenKey);
    }

    private get storage(): Storage | null {
        try {
            return this.document.defaultView?.sessionStorage ?? null;
        } catch {
            return null;
        }
    }
}