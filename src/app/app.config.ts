import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CustomTranslocoMissingHandler, TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco, provideTranslocoMissingHandler } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideAnimationsAsync(), provideHttpClient(), provideTransloco({
      config: {
        availableLangs: ['en'],
        defaultLang: 'en',
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoMissingHandler(CustomTranslocoMissingHandler)]
};
