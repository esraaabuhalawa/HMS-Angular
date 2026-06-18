import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { HotelPreset } from './core/theme/hotel-preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
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
