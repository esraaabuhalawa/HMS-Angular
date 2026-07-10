import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ThemeService } from './app/core/services/theme.service';

bootstrapApplication(App , appConfig).then(appRef => {
  const themeService = appRef.injector.get(ThemeService);
  themeService.initTheme();
}).catch((err) => console.error(err));

// bootstrapApplication(App, appConfig)
//   .catch((err) => console.error(err));
