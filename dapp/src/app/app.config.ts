import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import { NgxSpinnerModule } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withFetch(), ), // withInterceptors([AuthInterceptorService, ])
    provideAnimationsAsync(),
    CommonModule,
    NgxSpinnerModule, 
    provideHttpClient(), 
  ]
};
