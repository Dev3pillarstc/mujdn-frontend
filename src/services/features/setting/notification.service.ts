import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Notification } from '@/models/features/setting/notification';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $default: {
    model: () => Notification,
  },
  $pagination: {
    model: () => PaginatedList<Notification>,
    unwrap: 'data',
    shape: { 'list.*': () => Notification },
  },
})
@Injectable({
  providedIn: 'root',
})
export class NotificationService extends BaseCrudService<Notification> {
  override serviceName: string = 'NotificationService';

  override getUrlSegment(): string {
    return this.urlService.URLS.NOTIFICATION;
  }
}
