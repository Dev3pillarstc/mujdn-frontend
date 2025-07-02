import { Permission } from '@/models/features/lookups/permission/permission';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PermissionService } from '@/services/features/lookups/permission.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const permissionResolver: ResolveFn<PaginatedList<Permission> | null> = () => {
  const permissionService = inject(PermissionService);
  return permissionService.loadPaginated(new PaginationParams());
  // .pipe(
  //   catchError((error) => {
  //     return of(null); // Prevent throwing to allow route activation
  //   })
  // );
};
