import { BaseCrudService } from '@/abstracts/base-crud-service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { BlacklistedNationality } from '@/models/features/visit/blacklisted-nationality';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { Observable, of, switchMap } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => BlacklistedNationality,
  },
  $pagination: {
    model: () => PaginatedList<BlacklistedNationality>,
    unwrap: 'data',
    shape: { 'list.*': () => BlacklistedNationality },
  },
})
@Injectable({
  providedIn: 'root',
})
export class BlacklistedNationalityService extends BaseCrudService<BlacklistedNationality> {
  override serviceName: string = 'BlacklistedNationalityService';

  override getUrlSegment(): string {
    return this.urlService.URLS.BLACKLISTED_NATIONALITIES;
  }
}
