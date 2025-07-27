import { Injectable } from '@angular/core';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationParams } from '@/models/shared/pagination-params';
import { catchError, map, Observable } from 'rxjs';
import { MyAttendanceLogFilter } from '@/models/features/attendance/attendance-log/my-attendance-log-filter';
import { genericDateOnlyConvertor } from '@/utils/general-helper';
import { HttpParams } from '@angular/common/http';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => AttendanceLog,
  },
  $pagination: {
    model: () => PaginatedList<AttendanceLog>,
    unwrap: 'data',
    shape: { 'list.*': () => AttendanceLog },
  },
})
export class AttendanceService extends BaseCrudService<AttendanceLog, string> {
  serviceName: string = 'AttendanceService';

  getUrlSegment(): string {
    return this.urlService.URLS.ATTENDANCE;
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  loadMyAttendanceLogPaginatedSP(
    paginationParams?: PaginationParams,
    filterOptions?: MyAttendanceLogFilter
  ): Observable<PaginatedList<AttendanceLog>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<AttendanceLog>>(
        this.getUrlSegment() + '/GetMyAttendanceLogsWithPaging',
        filterOptions || {},
        {
          params: httpParams, // <-- query string
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as AttendanceLog[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      );
  }
}
