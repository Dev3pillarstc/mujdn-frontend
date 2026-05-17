import EmployeeShiftDay from '@/models/features/lookups/work-shifts/employee-shift-day';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { EmployeeShiftDayService } from '@/services/features/lookups/employee-shift-day.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

export const myShiftsContainerResolver: ResolveFn<{
  myShiftDays: PaginatedList<EmployeeShiftDay> | null;
} | null> = () => {
  const employeeShiftDayService = inject(EmployeeShiftDayService);

  return forkJoin({
    myShiftDays: employeeShiftDayService
      .loadMyShiftDaysPaginated(new PaginationParams())
      .pipe(catchError(() => of(null))),
  }).pipe(
    catchError((error) => {
      console.error('Error in myShiftsContainerResolver:', error);
      return of(null);
    })
  );
};
