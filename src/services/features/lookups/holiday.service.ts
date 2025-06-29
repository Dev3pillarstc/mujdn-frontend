import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Holiday } from '@/models/features/lookups/holiday/holiday';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $default: {
    model: () => Holiday,
  },
  $pagination: {
    model: () => PaginatedList<Holiday>,
    unwrap: 'data',
    shape: { 'list.*': () => Holiday },
  },
})
@Injectable({
  providedIn: 'root',
})
export class HolidayService extends BaseCrudService<Holiday> {
  override serviceName: string = 'HolidayService';

  override getUrlSegment(): string {
    return this.urlService.URLS.HOLIDAYS;
  }
}
