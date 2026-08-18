import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { RuntimeConfigService } from './core/config/runtime-config.service';
import { TOKEN_STORAGE } from './core/auth/token-storage';
import { BrowserTokenStorage } from './core/auth/browser-token-storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => inject(RuntimeConfigService).load()),
    {
      provide: TOKEN_STORAGE,
      useClass: BrowserTokenStorage
    }
  ]
};
