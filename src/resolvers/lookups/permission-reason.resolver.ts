import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PermissionReason } from '@/models/features/lookups/permission-reason/permission-reason';
import { PermissionReasonService } from '@/services/features/lookups/permission-reason.service';
import { catchError, of } from 'rxjs';

export const permissionReasonResolver: ResolveFn<PaginatedList<PermissionReason> | null> = () => {
  const permissionReasonService = inject(PermissionReasonService);
  return permissionReasonService.loadPaginated(new PaginationParams()).pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
