import { TemporaryRoleAssignment } from '@/models/features/temporary-role-assignment/temporary-role-assignment';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { TemporaryRoleAssignmentService } from '@/services/features/temporary-role-assignment.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const temporaryRoleAssignmentsResolver: ResolveFn<
  PaginatedList<TemporaryRoleAssignment> | null
> = () => {
  const temporaryRoleAssignmentService = inject(TemporaryRoleAssignmentService);

  return temporaryRoleAssignmentService
    .loadPaginated(new PaginationParams())
    .pipe(catchError(() => of(null)));
};
