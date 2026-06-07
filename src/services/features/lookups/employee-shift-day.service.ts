import { Injectable } from '@angular/core';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import EmployeeShiftDay from '@/models/features/lookups/work-shifts/employee-shift-day';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationParams } from '@/models/shared/pagination-params';
import { EmployeeShiftDayFilter } from '@/models/features/lookups/work-shifts/employee-shift-day-filter';
import { Observable, map } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { genericDateOnlyConvertor } from '@/utils/general-helper';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { OptionsContract } from '@/contracts/options-contract';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => EmployeeShiftDay,
  },
  $pagination: {
    model: () => PaginatedList<EmployeeShiftDay>,
    unwrap: 'data',
    shape: { 'list.*': () => EmployeeShiftDay },
  },
  $myShiftDaysPagination: {
    model: () => PaginatedList<EmployeeShiftDay>,
    unwrap: 'data',
    shape: { 'list.*': () => EmployeeShiftDay },
  },
})
export class EmployeeShiftDayService extends BaseCrudService<EmployeeShiftDay> {
  override serviceName = 'EmployeeShiftDayService';

  override getUrlSegment(): string {
    return this.urlService.URLS.EMPLOYEE_SHIFT_DAYS;
  }

  exportMyShiftDaysPdf(
    language: LANGUAGE_ENUM | string,
    filterOptions?: OptionsContract
  ): Observable<Blob> {
    return this.exportPdfByEndpoint('ExportMyShiftDaysPdf', language, filterOptions);
  }

  @CastResponse(undefined, { fallback: '$myShiftDaysPagination' })
  loadMyShiftDaysPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: EmployeeShiftDayFilter
  ): Observable<PaginatedList<EmployeeShiftDay>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);

    return this.http
      .post<PaginatedListResponseData<EmployeeShiftDay>>(
        this.getUrlSegment() + '/GetMyShiftDaysWithPaging',
        filterOptions || {},
        {
          params: httpParams,
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as EmployeeShiftDay[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      );
  }
}
