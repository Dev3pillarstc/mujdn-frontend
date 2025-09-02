import { BaseCrudService } from '@/abstracts/base-crud-service';
import { City } from '@/models/features/lookups/city/city';
import { CityLookup } from '@/models/features/lookups/city/city-lookup';
import { BlacklistedNationalId } from '@/models/features/visit/blacklisted-national-id';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable, model } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Observable, of, switchMap } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => BlacklistedNationalId,
  },
  $pagination: {
    model: () => PaginatedList<BlacklistedNationalId>,
    unwrap: 'data',
    shape: { 'list.*': () => BlacklistedNationalId },
  },
})
@Injectable({
  providedIn: 'root',
})
export class BlacklistedNationalIdService extends BaseCrudService<BlacklistedNationalId> {
  override serviceName: string = 'BlacklistedNationalIdService';

  override getUrlSegment(): string {
    return this.urlService.URLS.BLACKLISTED_NATIONAL_IDS;
  }
}
