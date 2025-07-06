import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
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
import { globalErrorHandler } from '@/http-interceptors/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    configInit,
    // globalErrorHandler(),
    SpinnerService,

    // Use both approaches
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor, AuthInterceptor]) // Functional interceptor
    ),
    provideRouter(routes),
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
