import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { inject } from '@angular/core';
import { ConfigService } from '@/services/config.service';

export function HttpLoaderFactory(http: HttpClient) {
  const configService = inject(ConfigService);

  const prefix =
    configService.CONFIG.BASE_ENVIRONMENT === 'DEV' ? 'assets/i18n/' : 'resources/i18n/';

  return new TranslateHttpLoader(http, prefix, `.json?v=${configService.CONFIG.DEPLOY_VERSION}`);
}
