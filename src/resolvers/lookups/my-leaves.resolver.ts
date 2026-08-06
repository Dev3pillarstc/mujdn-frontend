import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { LeaveService } from '@/services/features/lookups/leave.service';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Leave } from '@/models/features/lookups/leave/leave';
import { PaginationParams } from '@/models/shared/pagination-params';
import { catchError, of } from 'rxjs';

export const myLeavesResolver: ResolveFn<PaginatedList<Leave> | null> = () => {
  const leaveService = inject(LeaveService);
  return leaveService.loadMyLeavesPaginated(new PaginationParams()).pipe(
    catchError(() => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
