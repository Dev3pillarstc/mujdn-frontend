import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { AccessLocation } from '@/models/features/business/access-location';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $default: {
    model: () => AccessLocation,
  },
  $pagination: {
    model: () => PaginatedList<AccessLocation>,
    unwrap: 'data',
    shape: { 'list.*': () => AccessLocation },
  },
})
@Injectable({
  providedIn: 'root',
})
export class AccessLocationService extends LookupBaseService<AccessLocation, number> {
  serviceName: string = 'AccessLocationService';

  override getUrlSegment(): string {
    return this.urlService.URLS.ACCESS_LOCATIONS;
  }
}
