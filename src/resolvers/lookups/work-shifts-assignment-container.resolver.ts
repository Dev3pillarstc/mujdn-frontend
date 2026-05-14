import EmployeeShift from '@/models/features/lookups/work-shifts/employee-shift';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { MyShiftsService } from '@/services/features/lookups/my-shifts.service';
import { WorkDaysSettingService } from '@/services/features/setting/work-days-setting.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

export const workShiftsAssignmentContainerResolver: ResolveFn<{
  myShifts: PaginatedList<EmployeeShift> | null;
  currentShift: EmployeeShift | null;
  defaultworkDays: any;
} | null> = () => {
  const myShiftsService = inject(MyShiftsService);
  const workDaysSettingService = inject(WorkDaysSettingService);

  return forkJoin({
    myShifts: myShiftsService.getMyShifts(new PaginationParams()).pipe(catchError(() => of(null))),
    currentShift: myShiftsService.getMyCurrentShift().pipe(catchError(() => of(null))),
    defaultworkDays: workDaysSettingService.getWorkDays().pipe(catchError(() => of(null))),
  }).pipe(
    catchError((error) => {
      console.error('Error in workShiftsAssignmentContainerResolver:', error);
      return of(null);
    })
  );
};
