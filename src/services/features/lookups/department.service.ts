import { BaseCrudService } from '@/abstracts/base-crud-service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Department } from '@/models/features/lookups/department/department';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer, HasInterception } from 'cast-response';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => Department,
  },
  $pagination: {
    model: () => PaginatedList<Department>,
    unwrap: 'data',
    shape: { 'list.*': () => Department },
  },
  $lookup: {
    model: () => ListResponseData<BaseLookupModel>,
    unwrap: 'data',
    shape: { 'list.*': () => BaseLookupModel },
  },
})
export class DepartmentService extends BaseCrudService<Department> {
  override serviceName: string = 'DepartmentService';

  override getUrlSegment(): string {
    return this.urlService.URLS.DEPARTMENTS;
  }

  @CastResponse()
  @HasInterception
  getDepartmentTreeAsync(): Observable<ListResponseData<Department>> {
    return this.http.get<ListResponseData<Department>>(
      this.getUrlSegment() + '/' + 'GetDepartmentTreeAsync',
      { withCredentials: true }
    );
  }
  @CastResponse(undefined, { fallback: '$lookup' })
  getDepartmentsLookup(): Observable<BaseLookupModel[]> {
    return this.http
      .get<ListResponseData<BaseLookupModel>>(this.getUrlSegment() + '/' + 'lookup', {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ListResponseData<BaseLookupModel>) => {
          return of(response.data);
        })
      );
  }
}
