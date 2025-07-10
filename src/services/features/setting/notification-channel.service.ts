import { BaseCrudService } from '@/abstracts/base-crud-service';
import { NotificationChannel } from '@/models/features/setting/notification-channel';
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
    model: () => NotificationChannel,
  },
  $get: {
    model: () => NotificationChannel,
    unwrap: 'data',
    shape: { data: () => NotificationChannel },
  },
})
@Injectable({
  providedIn: 'root',
})
export class NotificationChannelService extends BaseCrudService<NotificationChannel> {
  serviceName = 'NotificationChannelService';

  override getUrlSegment(): string {
    return this.urlService.URLS.NOTIFICATION_CHANNELS;
  }

  @CastResponse(undefined, { fallback: '$get' })
  @HasInterception
  get(): Observable<NotificationChannel> {
    return this.http
      .get<ResponseData<NotificationChannel>>(this.getUrlSegment() + '/GetChannel', {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<NotificationChannel>) => {
          return of(response.data);
        })
      );
  }
}
