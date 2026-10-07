import { HttpRequest } from '@angular/common/http';

export function isApiRequest(url: string, apiBaseUrl: string): boolean {
    return url === apiBaseUrl || url.startsWith(`${apiBaseUrl}/`);
}

export function isRuntimeConfigRequest(url: string): boolean {
    return url === 'config/app-config.json' || url.endsWith('/config/app-config.json');
}

export function withBearerToken<T>(request: HttpRequest<T>, accessToken: string): HttpRequest<T> {
    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`
        }
    });
}

export function readBearerToken(value: string | null): string | null {
    if (!value) {
        return null;
    }

    const match = /^Bearer\s+(.+)$/i.exec(value);
    return match?.[1]?.trim() || null;
}