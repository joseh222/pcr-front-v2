import { InjectionToken } from '@angular/core';

import { AuthTokens } from './auth-tokens.model';

export interface TokenStorage {
    getAccessToken(): string | null;
    getRefreshToken(): string | null;
    setTokens(tokens: AuthTokens): void;
    clear(): void;
}

export const TOKEN_STORAGE = new InjectionToken<TokenStorage>('TOKEN_STORAGE');