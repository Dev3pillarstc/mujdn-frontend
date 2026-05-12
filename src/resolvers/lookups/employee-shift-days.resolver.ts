import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { EmployeeShiftDayService } from '@/services/features/lookups/employee-shift-day.service';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationParams } from '@/models/shared/pagination-params';
import EmployeeShiftDay from '@/models/features/lookups/work-shifts/employee-shift-day';
import { catchError, of } from 'rxjs';

export const employeeShiftDaysResolver: ResolveFn<PaginatedList<EmployeeShiftDay> | null> = () => {
  return inject(EmployeeShiftDayService)
    .loadPaginated(new PaginationParams())
    .pipe(catchError(() => of(null)));
};
