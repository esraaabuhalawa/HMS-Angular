import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { HotelPreset } from './core/theme/hotel-preset';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { generalInterceptor } from './core/interceptors/general-interceptor';
import { unAuthInterceptor } from './core/interceptors/un-auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([generalInterceptor,unAuthInterceptor])
    ),

    MessageService,
    providePrimeNG({
      theme: {
        preset: HotelPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: false
        }
      }
      // theme: {
      //   preset: HotelPreset,
      //   options: {
      //     darkModeSelector: '.app-dark', // toggle this class on <html> for dark mode
      //     cssLayer: {
      //       name: 'primeng',
      //       order: 'tailwind-base, primeng, tailwind-utilities', // if using Tailwind
      //     },
      //   },
      // },
    }),
  ]
};
