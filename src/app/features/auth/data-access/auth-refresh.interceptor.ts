import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';

import { isApiRequest, isRuntimeConfigRequest, readBearerToken, withBearerToken } from '../../../core/auth/auth-http.util';
import { SKIP_AUTH } from '../../../core/auth/auth-http-context';
import { TOKEN_STORAGE } from '../../../core/auth/token-storage';
import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import { AuthStore } from './auth.store';

export const authRefreshInterceptor: HttpInterceptorFn = (request, next) => {
    if (request.context.get(SKIP_AUTH) || isRuntimeConfigRequest(request.url)) {
        return next(request);
    }

    const runtimeConfig = inject(RuntimeConfigService);

    if (!isApiRequest(request.url, runtimeConfig.config.apiBaseUrl)) {
        return next(request);
    }

    const authStore = inject(AuthStore);
    const tokenStorage = inject(TOKEN_STORAGE);
    const router = inject(Router);

    return next(request).pipe(
        catchError(error => {
            if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
                return throwError(() => error);
            }

            const failedAccessToken = readBearerToken(request.headers.get('Authorization'));
            const currentAccessToken = tokenStorage.getAccessToken();

            if (currentAccessToken && failedAccessToken && currentAccessToken !== failedAccessToken) {
                return next(withBearerToken(request, currentAccessToken));
            }

            return from(authStore.refreshAccessToken()).pipe(
                switchMap(accessToken => next(withBearerToken(request, accessToken))),
                catchError(refreshError => {
                    authStore.clearSession();
                    void router.navigate(['/login'], { replaceUrl: true });

                    return throwError(() => refreshError);
                })
            );
        })
    );
};