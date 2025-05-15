import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideClientHydration } from '@angular/platform-browser'
import { routes } from '@/routes/app.routes'
import { provideInterceptors } from 'cast-response'
import { GeneralInterceptor } from '@/model-interceptors/general-interceptor'
import configInit from '../inits/config.init'
import { provideHttpClient, withFetch } from '@angular/common/http'

export const appConfig: ApplicationConfig = {
  providers: [
    configInit,
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    provideInterceptors([GeneralInterceptor]),
  ],
}
