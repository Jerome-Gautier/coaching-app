import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideEchartsCore, NgxEchartsConfig } from 'ngx-echarts';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // lazy-load echarts to keep it out of the initial bundle
    provideEchartsCore({ echarts: () => import('echarts') } as unknown as NgxEchartsConfig),
  ]
};
