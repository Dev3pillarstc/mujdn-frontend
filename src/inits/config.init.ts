import { inject, provideAppInitializer } from '@angular/core';
import { ConfigService } from '@/services/config.service';
import { UrlService } from '@/services/url.service';
import { forkJoin, tap } from 'rxjs';

export default provideAppInitializer(() => {
  return ((configService, urlService) => {
    return forkJoin([configService.load()]).pipe(
      tap(() => urlService.setConfigService(configService)),
      tap(() => urlService.prepareUrls())
    );
  })(inject(ConfigService), inject(UrlService));
});
