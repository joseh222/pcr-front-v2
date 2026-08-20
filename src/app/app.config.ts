import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RuntimeConfigService } from './core/config/runtime-config.service';
import { TOKEN_STORAGE } from './core/auth/token-storage';
import { BrowserTokenStorage } from './core/auth/browser-token-storage';
import { authTokenInterceptor } from './core/auth/interceptors/auth-token.interceptor';
import { AuthStore } from './features/auth/data-access/auth.store';
import { authRefreshInterceptor } from './features/auth/data-access/auth-refresh.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    
    importProvidersFrom(MatSnackBarModule),
    
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authTokenInterceptor,
      authRefreshInterceptor
    ])),
    provideAppInitializer(() => {
      const runtimeConfig = inject(RuntimeConfigService);
      const authStore = inject(AuthStore);

      return runtimeConfig.load().then(() => authStore.initialize());
    }),
    {
      provide: TOKEN_STORAGE,
      useClass: BrowserTokenStorage
    }
  ]
};
