import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideEchartsCore, NgxEchartsConfig } from 'ngx-echarts';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // lazy-load echarts to keep it out of the initial bundle
    provideEchartsCore({ echarts: () => import('echarts') } as unknown as NgxEchartsConfig),
  ]
};