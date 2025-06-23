import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Department } from '@/models/features/lookups/Department/department';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer, HasInterception } from 'cast-response';
import { Observable } from 'rxjs';

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
}
