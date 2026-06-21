import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  TransferState,
} from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { MessageService } from 'primeng/api';

import { providePrimeNG } from 'primeng/config';
import {
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

import { routes } from './app.routes';
import { HotelPreset } from './core/theme/hotel-preset';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { generalInterceptor } from './core/interceptors/general-interceptor';
import { environment } from '../environments/environment';
import { errorInterceptor } from './core/interceptors/error-interceptor';

import {  TranslateLoader,provideTranslateService } from '@ngx-translate/core';
import { translateLoaderFactory } from './core/translation/translate-loader';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),

    provideHttpClient(withInterceptors([generalInterceptor, errorInterceptor])),
    MessageService,
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient,TransferState],
      },
    }),
    providePrimeNG({
      theme: {
        preset: HotelPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: false,
        },
      },
    }),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId, {
              oneTapEnabled: false,
            }),
          },
          // {
          // id: FacebookLoginProvider.PROVIDER_ID,
          // provider: new FacebookLoginProvider(
          //   environment.facebookAppId,
          //   {
          //     version: 'v18.0',
          //   }
          // ),}
        ],
        onError: (err: any) => console.error(err),
      } as SocialAuthServiceConfig,
    },
  ],
};
