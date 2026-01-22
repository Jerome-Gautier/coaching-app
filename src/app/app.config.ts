import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideEchartsCore, NgxEchartsConfig } from 'ngx-echarts';
import * as echarts from 'echarts';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideEchartsCore({ echarts } as NgxEchartsConfig),
  ]
};
