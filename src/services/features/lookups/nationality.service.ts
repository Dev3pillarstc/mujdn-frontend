import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Nationality } from '@/models/features/lookups/Nationality';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { LookupBaseService } from '@/abstracts/lookup-base.service';

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
export class NationalityService extends LookupBaseService<Nationality, number> {
  serviceName: string = 'NationalityService';

  override getUrlSegment(): string {
    return this.urlService.URLS.NATIONALITIES;
  }
}
