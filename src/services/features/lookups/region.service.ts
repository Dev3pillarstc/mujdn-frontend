import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Region } from '@/models/features/lookups/region/region';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $default: {
    model: () => Region,
  },
  $pagination: {
    model: () => PaginatedList<Region>,
    unwrap: 'data',
    shape: { 'list.*': () => Region },
  },
})
@Injectable({
  providedIn: 'root',
})
export class RegionService extends BaseCrudService<Region> {
  serviceName: string = 'RegionService';

  override getUrlSegment(): string {
    return this.urlService.URLS.REGIONS;
  }
}
