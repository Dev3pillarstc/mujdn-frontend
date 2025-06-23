import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Department } from '@/models/features/lookups/Department/department';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

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
}
