import {ApplicationConfig} from '@angular/core'
import {provideRouter} from '@angular/router'
import {routes} from '@/routes/app.routes'
import {provideInterceptors} from 'cast-response'
import {GeneralInterceptor} from '@/model-interceptors/general-interceptor'
import configInit from '../inits/config.init'
import {provideHttpClient, withFetch} from '@angular/common/http'
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    configInit,
    provideHttpClient(withFetch()),
    provideRouter(routes),
    // provideClientHydration(),
    provideInterceptors([GeneralInterceptor]),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
}
