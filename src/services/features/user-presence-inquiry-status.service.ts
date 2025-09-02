import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserPresenceInquiryStatusService extends LookupBaseService<BaseLookupModel, number> {
  serviceName: string = 'UserPresenceInquiryStatusService';

  override getUrlSegment(): string {
    return this.urlService.URLS.USER_PRESENCE_INQUIRY_STATUS;
  }
}
