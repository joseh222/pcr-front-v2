import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { isApiRequest, isRuntimeConfigRequest, withBearerToken } from '../auth-http.util';
import { SKIP_AUTH } from '../auth-http-context';
import { TOKEN_STORAGE } from '../token-storage';
import { RuntimeConfigService } from '../../config/runtime-config.service';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
    if (request.context.get(SKIP_AUTH) || isRuntimeConfigRequest(request.url)) {
        return next(request);
    }

    const runtimeConfig = inject(RuntimeConfigService);
    const tokenStorage = inject(TOKEN_STORAGE);
    const apiBaseUrl = runtimeConfig.config.apiBaseUrl;

    if (!isApiRequest(request.url, apiBaseUrl) || request.headers.has('Authorization')) {
        return next(request);
    }

    const accessToken = tokenStorage.getAccessToken();

    if (!accessToken) {
        return next(request);
    }

    return next(withBearerToken(request, accessToken));
};