import { BaseCrudService } from '@/abstracts/base-crud-service';
import { OptionsContract } from '@/contracts/options-contract';
import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { genericDateOnlyConvertor } from '@/utils/general-helper';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer, HasInterception } from 'cast-response';
import { Observable, map, catchError } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => PresenceInquiry,
  },
  $pagination: {
    model: () => PaginatedList<PresenceInquiry>,
    unwrap: 'data',
    shape: { 'list.*': () => PresenceInquiry },
  },
})
@Injectable({
  providedIn: 'root',
})
export class PresenceInquiryService extends BaseCrudService<PresenceInquiry> {
  serviceName: string = 'PresenceInquiryService';

  override getUrlSegment(): string {
    return this.urlService.URLS.PRESENCE_INQUIRIES;
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  loadPresenceInquiriesPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<PresenceInquiry>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<PresenceInquiry>>(
        this.getUrlSegment() + '/GetAllPresenceInquiriesAsync',
        filterOptions || {},
        {
          params: httpParams,
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => ({
          list: response.data.list as PresenceInquiry[],
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
  loadMyPresenceInquiriesPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<PresenceInquiry>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<PresenceInquiry>>(
        this.getUrlSegment() + '/GetMyPresenceInquiriesAsync',
        filterOptions || {},
        {
          params: httpParams,
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => ({
          list: response.data.list as PresenceInquiry[],
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
  @HasInterception
  assignInquiryToUsers(inquiryId: number, userIds: number[]): Observable<PresenceInquiry> {
    const url = `${this.getUrlSegment()}/${inquiryId}/assign`;
    return this.http.post<PresenceInquiry>(url, { userIds }, { withCredentials: true });
  }
}
