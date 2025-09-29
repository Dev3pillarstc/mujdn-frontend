import { BaseCrudService } from '@/abstracts/base-crud-service';
import { BlacklistedNationalId } from '@/models/features/visit/blacklisted-national-id';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

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
