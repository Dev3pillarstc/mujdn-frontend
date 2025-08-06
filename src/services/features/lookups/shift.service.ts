import { BaseCrudService } from '@/abstracts/base-crud-service';
import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { OptionsContract } from '@/contracts/options-contract';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import EmployeeShifts from '@/models/features/lookups/work-shifts/employee-shifts';
import Shift from '@/models/features/lookups/work-shifts/shift';
import { PaginationParams } from '@/models/shared/pagination-params';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { SingleResponseData } from '@/models/shared/response/single-response-data';
import { genericDateOnlyConvertor } from '@/utils/general-helper';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';
import { map, Observable, of, switchMap } from 'rxjs';

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
  $currentShift: {
    model: () => SingleResponseData<EmployeeShifts>
  },
  $myShiftsPaginated: {
    model: () => PaginatedList<EmployeeShifts>,
    unwrap: 'data',
    shape: { 'list.*': () => EmployeeShifts },
  }
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
  @CastResponse(undefined, { fallback: '$currentShift' })
  getMyCurrentShift() {
    return this.http.get<SingleResponseData<EmployeeShifts>>(this.getUrlSegment() + '/' + 'GetMyCurrentShift', {
      withCredentials: true,
    })
      .pipe(
        switchMap((response: SingleResponseData<EmployeeShifts>) => {
          return of(response.data);
        })
      );
  }

  @CastResponse(undefined, { fallback: '$myShiftsPaginated' })
  getMyShifts(paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined) {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);

    // ADD RETURN HERE!
    return this.http
      .post<PaginatedListResponseData<EmployeeShifts>>(
        this.getUrlSegment() + '/GetMyShifts',
        filterOptions || {},
        {
          params: httpParams, // <-- query string
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as EmployeeShifts[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      );
  }
}
