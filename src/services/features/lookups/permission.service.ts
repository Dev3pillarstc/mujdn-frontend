import { BaseCrudService } from '@/abstracts/base-crud-service';
import { OptionsContract } from '@/contracts/options-contract';
import { Permission } from '@/models/features/lookups/permission/permission';
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
    model: () => Permission,
  },
  $pagination: {
    model: () => PaginatedList<Permission>,
    unwrap: 'data',
    shape: { 'list.*': () => Permission },
  },
})
@Injectable({
  providedIn: 'root',
})
export class PermissionService extends BaseCrudService<Permission> {
  serviceName: string = 'PermissionService';

  override getUrlSegment(): string {
    return this.urlService.URLS.PERMISSIONS;
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  loadDepartmentPermissionPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<Permission>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<Permission>>(
        this.getUrlSegment() + '/GetDepartmentPermissionsWithPaging',
        filterOptions || {},
        {
          params: httpParams, // <-- query string
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Permission[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      )
      .pipe(
        catchError((err) => {
          // Let the global ErrorHandler handle it
          throw err;
        })
      );
  }
  @CastResponse()
  @HasInterception
  updateStatus(id: number, fkStatusId: number): Observable<Permission> {
    const url = `${this.getUrlSegment()}/${id}/status?fkStatusId=${fkStatusId}`;
    return this.http.put<Permission>(url, null, { withCredentials: true });
  }
}
