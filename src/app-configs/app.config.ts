import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from '@/routes/app.routes';
import { GeneralInterceptor } from '@/model-interceptors/general-interceptor';
import configInit from '../inits/config.init';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { loadingInterceptor } from '@/http-interceptors/loading.interceptor';
import { SpinnerService } from '@/services/shared/spinner.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '@/configs/translate-loader';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { provideInterceptors } from 'cast-response';
import { AuthInterceptor } from '@/http-interceptors/auth.interceptor';
import { httpErrorInterceptor } from '@/http-interceptors/http-error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    configInit,
    SpinnerService,

    // Use both approaches
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor, AuthInterceptor, httpErrorInterceptor]) // Functional interceptor
    ),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // always scrolls to top on navigation
        anchorScrolling: 'enabled', // optional, enables anchor (#fragment) jumps
      })
    ),
    // provideClientHydration(),
    provideInterceptors([GeneralInterceptor]),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: LANGUAGE_ENUM.ENGLISH,
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};
