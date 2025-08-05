import { BaseCrudService } from '@/abstracts/base-crud-service';
import { NotificationSetting } from '@/models/features/setting/notification-setting';
import { ResponseData } from '@/models/shared/response/response-data';
import { Injectable } from '@angular/core';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';
import { catchError, Observable, of, switchMap } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => NotificationSetting,
  },
  $get: {
    model: () => NotificationSetting,
    unwrap: 'data',
    shape: { data: () => NotificationSetting },
  },
})
@Injectable({
  providedIn: 'root',
})
export class NotificationSettingService extends BaseCrudService<NotificationSetting> {
  serviceName = 'NotificationSettingService';

  override getUrlSegment(): string {
    return this.urlService.URLS.NOTIFICATION_SETTINGS;
  }

  @CastResponse(undefined, { fallback: '$get' })
  @HasInterception
  get(): Observable<NotificationSetting> {
    return this.http
      .get<ResponseData<NotificationSetting>>(this.getUrlSegment(), {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<NotificationSetting>) => {
          return of(response.data);
        })
      );
  }
}
