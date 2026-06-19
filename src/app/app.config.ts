import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { providePrimeNG } from 'primeng/config';
import {
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from '@abacritt/angularx-social-login';

import { routes } from './app.routes';
import { HotelPreset } from './core/theme/hotel-preset';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { generalInterceptor } from './core/interceptors/general-interceptor';
import { unAuthInterceptor } from './core/interceptors/un-auth-interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([generalInterceptor, unAuthInterceptor])
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
      },
    }),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId,
              {
                oneTapEnabled: false,
              }
            ),
          },
        {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(
          environment.facebookAppId,
          {
            version: 'v18.0',
          }
        ),}
        ],
        onError: (err: any) => console.error(err),
      } as SocialAuthServiceConfig,
    },
  ]
};
