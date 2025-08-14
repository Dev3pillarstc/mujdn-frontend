import { BaseCrudService } from '@/abstracts/base-crud-service';
import { MyCreatedVisitFilter } from '@/models/features/visit/my-created-visit-filter';
import { Visit } from '@/models/features/visit/visit';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { genericDateOnlyConvertor } from '@/utils/general-helper';
import { HttpParams } from '@angular/common/module.d-CnjH8Dlt';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { map, Observable } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => Visit,
  },
  $pagination: {
    model: () => PaginatedList<Visit>,
    unwrap: 'data',
    shape: { 'list.*': () => Visit },
  },
  $visitor: {
    model: () => Visit,
    unwrap: 'data',
  },
})
@Injectable({
  providedIn: 'root',
})
export class VisitService extends BaseCrudService<Visit> {
  override serviceName: string = 'VisitService';

  @CastResponse(undefined, { fallback: '$visitor' })
  loadVisitorByNationalId(nationalId: string): Observable<Visit> {
    return this.http.get<Visit>(this.getUrlSegment() + '/visitor', {
      params: {
        nationalId,
      },
    });
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  loadMyCreatedVisitsPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: MyCreatedVisitFilter
  ): Observable<PaginatedList<Visit>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<Visit>>(
        this.getUrlSegment() + '/GetMyCreatedVisitsWithPaging',
        filterOptions || {},
        {
          params: httpParams, // <-- query string
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Visit[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      );
  }

  override getUrlSegment(): string {
    return this.urlService.URLS.VISITS;
  }
}
