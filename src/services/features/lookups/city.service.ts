import { BaseCrudService } from '@/abstracts/base-crud-service';
import { City } from '@/models/features/lookups/City/city';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $default: {
    model: () => City,
  },
  $pagination: {
    model: () => PaginatedList<City>,
    unwrap: 'data',
    shape: { 'list.*': () => City },
  },
})
@Injectable({
  providedIn: 'root',
})
export class CityService extends BaseCrudService<City> {
  override serviceName: string = 'CityService';

  override getUrlSegment(): string {
    return this.urlService.URLS.CITIES;
  }
}
