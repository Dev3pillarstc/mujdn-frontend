import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Holiday } from '@/models/features/lookups/holiday/holiday';
import { HolidayFilter } from '@/models/features/lookups/holiday/holiday-filter';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer, HasInterception } from 'cast-response';
import { Observable, of, switchMap } from 'rxjs';
import { format } from 'date-fns';

@CastResponseContainer({
  $default: {
    model: () => Holiday,
  },
  $pagination: {
    model: () => PaginatedList<Holiday>,
    unwrap: 'data',
    shape: { 'list.*': () => Holiday },
  },
  $filtered: {
    model: () => Holiday,
    unwrap: 'data',
    shape: { data: () => Holiday },
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

  @CastResponse(undefined, { fallback: '$filtered' })
  @HasInterception
  getFilteredHolidays(filter: HolidayFilter): Observable<Holiday[]> {
    const formattedFilter = {
      ...filter,
      dateFrom: filter.dateFrom ? format(new Date(filter.dateFrom), 'yyyy-MM-dd') : undefined,
      dateTo: filter.dateTo ? format(new Date(filter.dateTo), 'yyyy-MM-dd') : undefined,
    };
    return this.http
      .post<
        ListResponseData<Holiday>
      >(`${this.getUrlSegment()}/GetFilteredHolidays`, formattedFilter, { withCredentials: true })
      .pipe(
        switchMap((response: ListResponseData<Holiday>) => {
          return of(response.data);
        })
      );
  }
}
