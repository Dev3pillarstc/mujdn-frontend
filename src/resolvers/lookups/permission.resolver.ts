import { Permission } from '@/models/features/lookups/permission/permission';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { AuthService } from '@/services/auth/auth.service';
import { PermissionService } from '@/services/features/lookups/permission.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';

export const permissionResolver: ResolveFn<PaginatedList<Permission> | null> = () => {
  const permissionService = inject(PermissionService);
  const authService = inject(AuthService);
  let returnedList: Observable<PaginatedList<Permission>>;
  if (authService.isDeprtmentActualManager && authService.isRootDeprtment) {
    returnedList = permissionService.loadDepartmentPermissionPaginated(new PaginationParams());
  } else {
    returnedList = permissionService.loadPaginated(new PaginationParams());
  }
  return returnedList.pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
