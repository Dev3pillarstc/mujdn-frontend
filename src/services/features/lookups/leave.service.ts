import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Leave } from '@/models/features/lookups/leave/leave';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { PaginationParams } from '@/models/shared/pagination-params';
import { OptionsContract } from '@/contracts/options-contract';
import { genericDateOnlyConvertor, toDateOnly } from '@/utils/general-helper';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => Leave,
  },
  $pagination: {
    model: () => PaginatedList<Leave>,
    unwrap: 'data',
    shape: { 'list.*': () => Leave },
  },
})
@Injectable({
  providedIn: 'root',
})
export class LeaveService extends BaseCrudService<Leave, number> {
  serviceName: string = 'LeaveService';

  override getUrlSegment(): string {
    return this.urlService.URLS.LEAVES;
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  loadMyLeavesPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<Leave>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<Leave>>(
        this.getUrlSegment() + '/GetMyLeavesWithPaging',
        filterOptions || {},
        {
          params: httpParams,
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => ({
          list: response.data.list as Leave[],
          paginationInfo: response.data.paginationInfo,
        }))
      )
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  loadMyCreatedLeavesPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<Leave>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<Leave>>(
        this.getUrlSegment() + '/GetMyCreatedLeavesWithPaging',
        filterOptions || {},
        {
          params: httpParams,
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => ({
          list: response.data.list as Leave[],
          paginationInfo: response.data.paginationInfo,
        }))
      )
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
  }

  @CastResponse()
  acceptLeave(
    leaveId: number,
    dateFrom?: Date | string | null,
    dateTo?: Date | string | null
  ): Observable<Leave> {
    const body =
      dateFrom && dateTo ? { dateFrom: toDateOnly(dateFrom), dateTo: toDateOnly(dateTo) } : {};
    return this.http.put<Leave>(`${this.getUrlSegment()}/${leaveId}/accept`, body, {
      withCredentials: true,
    });
  }

  @CastResponse()
  rejectLeave(leaveId: number, rejectionNotes?: string | null): Observable<Leave> {
    const body = rejectionNotes ? { rejectionNotes } : {};
    return this.http.put<Leave>(`${this.getUrlSegment()}/${leaveId}/reject`, body, {
      withCredentials: true,
    });
  }

  exportMyLeavesPdf(
    language: LANGUAGE_ENUM | string,
    filterOptions?: OptionsContract
  ): Observable<Blob> {
    return this.exportPdfByEndpoint('ExportMyLeavesPdf', language, filterOptions);
  }

  exportMyCreatedLeavesPdf(
    language: LANGUAGE_ENUM | string,
    filterOptions?: OptionsContract
  ): Observable<Blob> {
    return this.exportPdfByEndpoint('ExportMyCreatedLeavesPdf', language, filterOptions);
  }

  exportDepartmentLeavesPdf(
    language: LANGUAGE_ENUM | string,
    filterOptions?: OptionsContract
  ): Observable<Blob> {
    return this.exportPdfByEndpoint('ExportDepartmentLeavesPdf', language, filterOptions);
  }
}
