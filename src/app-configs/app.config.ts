import {ApplicationConfig, importProvidersFrom} from '@angular/core'
import {provideRouter} from '@angular/router'
import {routes} from '@/routes/app.routes'
import {provideInterceptors} from 'cast-response'
import {GeneralInterceptor} from '@/model-interceptors/general-interceptor'
import configInit from '../inits/config.init'
import {HttpClient, provideHttpClient, withFetch} from '@angular/common/http'
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '@/configs/translate-loader';
import {LANGUAGE_ENUM} from '@/enums/language-enum';

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
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: LANGUAGE_ENUM.ENGLISH,
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ],
}
