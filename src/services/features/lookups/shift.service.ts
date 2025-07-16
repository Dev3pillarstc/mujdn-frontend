import { BaseCrudService } from '@/abstracts/base-crud-service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import Shift from '@/models/features/lookups/work-shifts/shift';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => Shift,
  },
  $pagination: {
    model: () => PaginatedList<Shift>,
    unwrap: 'data',
    shape: { 'list.*': () => Shift },
  },
  $lookup: {
    model: () => ListResponseData<BaseLookupModel>,
    unwrap: 'data',
    shape: { 'list.*': () => BaseLookupModel },
  },
})
export class ShiftService extends BaseCrudService<Shift> {
  override serviceName: string = 'ShiftService';
  constructor() {
    super();
  }
  override getUrlSegment(): string {
    return this.urlService.URLS.SHIFTS;
  }
}
