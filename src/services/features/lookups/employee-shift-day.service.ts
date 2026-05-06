import { Injectable } from '@angular/core';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import EmployeeShiftDay from '@/models/features/lookups/work-shifts/employee-shift-day';
import { CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => EmployeeShiftDay,
  },
  $pagination: {
    model: () => PaginatedList<EmployeeShiftDay>,
    unwrap: 'data',
    shape: { 'list.*': () => EmployeeShiftDay },
  },
})
export class EmployeeShiftDayService extends BaseCrudService<EmployeeShiftDay> {
  override serviceName = 'EmployeeShiftDayService';

  override getUrlSegment(): string {
    return this.urlService.URLS.EMPLOYEE_SHIFT_DAYS;
  }
}
