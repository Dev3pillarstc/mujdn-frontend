import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Holiday } from '@/models/features/lookups/holiday/holiday';
import { HolidayFilter } from '@/models/features/lookups/holiday/holiday-filter';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer, HasInterception } from 'cast-response';
import { map, Observable } from 'rxjs';
import { format } from 'date-fns';
import { PaginationParams } from '@/models/shared/pagination-params';
import { HttpParams } from '@angular/common/http';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';

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

  @CastResponse(undefined, { fallback: '$pagination' })
  @HasInterception
  getFilteredHolidays(
    filter: HolidayFilter,
    paginationParams?: PaginationParams
  ): Observable<PaginatedList<Holiday>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    const formattedFilter = {
      ...filter,
      dateFrom: filter.dateFrom ? format(new Date(filter.dateFrom), 'yyyy-MM-dd') : undefined,
      dateTo: filter.dateTo ? format(new Date(filter.dateTo), 'yyyy-MM-dd') : undefined,
    };
    return this.http
      .post<PaginatedListResponseData<Holiday>>(
        `${this.getUrlSegment()}/GetFilteredHolidays`,
        formattedFilter,
        {
          params: httpParams,
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Holiday[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      );
  }
}
