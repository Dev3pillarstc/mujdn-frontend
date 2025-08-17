import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PresenceInquiryStatusService extends LookupBaseService<BaseLookupModel, number> {
  serviceName: string = 'PresenceInquiryStatusService';

  override getUrlSegment(): string {
    return this.urlService.URLS.PRESENCE_INQUIRY_STATUS;
  }
}
