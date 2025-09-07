import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { AccessLocation } from '@/models/features/business/access-location';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccessLocationService extends LookupBaseService<AccessLocation, number> {
  serviceName: string = 'AccessLocationService';

  override getUrlSegment(): string {
    return this.urlService.URLS.ACCESS_LOCATIONS;
  }
}
