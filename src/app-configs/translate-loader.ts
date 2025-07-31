import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { inject } from '@angular/core';
import { ConfigService } from '@/services/config.service';

export function HttpLoaderFactory(http: HttpClient) {
  const configService = inject(ConfigService);
  return new TranslateHttpLoader(
    http,
    'assets/i18n/',
    `.json?v=${configService.CONFIG.DEPLOY_VERSION}`
  );
}
