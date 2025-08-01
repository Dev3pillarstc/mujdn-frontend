import { BaseCrudService } from '@/abstracts/base-crud-service';
import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import Shift from '@/models/features/lookups/work-shifts/shift';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { SingleResponseData } from '@/models/shared/response/single-response-data';
import { Injectable } from '@angular/core';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';
import { Observable } from 'rxjs';

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
export class ShiftService extends LookupBaseService<Shift, number> {
  override serviceName: string = 'ShiftService';
  constructor() {
    super();
  }
  override getUrlSegment(): string {
    return this.urlService.URLS.SHIFTS;
  }

  //@CastResponse(undefined, { fallback: '$default' })
  @HasInterception
  activateShift(
    @InterceptParam() shift: Shift,
    shiftId: number
  ): Observable<SingleResponseData<string>> {
    return this.http.post<SingleResponseData<string>>(
      this.getUrlSegment() + '/AddShiftLog/' + shiftId,
      shift,
      { withCredentials: true }
    );
  }
}
