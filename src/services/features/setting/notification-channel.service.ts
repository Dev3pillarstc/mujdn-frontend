
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { NotificationChannel } from '@/models/features/setting/notification-channel';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer, HasInterception, InterceptParam } from 'cast-response';
import { Observable } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => NotificationChannel,
  }
})

@Injectable({
  providedIn: 'root',
})

export class NotificationChannelService extends BaseCrudService<NotificationChannel> {
  serviceName = 'NotificationChannelService';

  override getUrlSegment(): string {
    return this.urlService.URLS.NOTIFICATION_CHANNELS;
  }


 @CastResponse()
  getSingle(): Observable<NotificationChannel> {
    return this.http.get<NotificationChannel>(this.getUrlSegment(), {
      withCredentials: true,
    });
  }

  @CastResponse()
  @HasInterception
  updateSingle(@InterceptParam() model: NotificationChannel): Observable<NotificationChannel> {
    return this.http.put<NotificationChannel>(this.getUrlSegment(), model, {
      withCredentials: true,
    });
  }

  @CastResponse()
  ensure(): Observable<NotificationChannel> {
    return this.http.post<NotificationChannel>(
      this.getUrlSegment() + '/ensure',
      {},
      { withCredentials: true }
    );
  }
}
