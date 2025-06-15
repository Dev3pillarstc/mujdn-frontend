import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Nationality } from '@/models/features/lookups/Nationality';
import { NationalityFilter } from '@/models/features/lookups/Nationality-filter';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';

@CastResponseContainer({
  $default: {
    model: () => Nationality,
  },
  $pagination: {
    model: () => PaginatedList<Nationality>,
    unwrap: 'data',
    shape: { 'list.*': () => Nationality },
  },
})
@Injectable({
  providedIn: 'root',
})
export class NationalityService extends BaseCrudService<Nationality> {
  serviceName: string = 'NationalityService';

  override getUrlSegment(): string {
    return this.urlService.URLS.NATIONALITIES;
  }
}
