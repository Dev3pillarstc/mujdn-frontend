import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationTypeService extends LookupBaseService<BaseLookupModel, number> {
  serviceName: string = 'NotificationTypeService';

  override getUrlSegment(): string {
    return this.urlService.URLS.NOTIFICATION_TYPES;
  }
}
