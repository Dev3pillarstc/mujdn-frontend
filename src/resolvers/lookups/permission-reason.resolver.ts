import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PermissionReason } from '@/models/features/lookups/permission-reason/permission-reason';
import { PermissionReasonService } from '@/services/features/lookups/permission-reason.service';

export const permissionReasonResolver: ResolveFn<PaginatedList<PermissionReason>> = () => {
  const permissionReasonService = inject(PermissionReasonService);
  return permissionReasonService.loadPaginated(new PaginationParams());
};
