import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { LeaveTypeService } from '@/services/features/lookups/leave-type.service';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { LeaveType } from '@/models/features/lookups/LeaveType';
import { PaginationParams } from '@/models/shared/pagination-params';
import { catchError, of } from 'rxjs';

export const leaveTypesResolver: ResolveFn<PaginatedList<LeaveType> | null> = () => {
  const leaveTypeService = inject(LeaveTypeService);
  return leaveTypeService.loadPaginated(new PaginationParams()).pipe(
    catchError(() => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
