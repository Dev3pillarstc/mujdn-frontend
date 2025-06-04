import {ApplicationConfig} from '@angular/core'
import {provideRouter} from '@angular/router'
import {routes} from '@/routes/app.routes'
import {provideInterceptors} from 'cast-response'
import {GeneralInterceptor} from '@/model-interceptors/general-interceptor'
import configInit from '../inits/config.init'
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http'
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { loadingInterceptor } from '@/http-interceptors/loading.interceptor'
import { SpinnerService } from '@/services/shared/spinner.service'

export const appConfig: ApplicationConfig = {
  providers: [
    SpinnerService,
    
    // Use both approaches
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor]) // Functional interceptor
    ),
    
    // Class-based interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GeneralInterceptor,
      multi: true
    },
    
    provideRouter(routes),
    // provideClientHydration(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
};