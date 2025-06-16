import { BaseCrudService } from '@/abstracts/base-crud-service';

import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PermissionReason } from '@/models/features/lookups/permission-reason/permission-reason';

@CastResponseContainer({
  $default: {
    model: () => PermissionReason,
  },
  $pagination: {
    model: () => PaginatedList<PermissionReason>,
    unwrap: 'data',
    shape: { 'list.*': () => PermissionReason },
  },
})
@Injectable({
  providedIn: 'root',
})
export class PermissionReasonService extends BaseCrudService<PermissionReason> {
  serviceName: string = 'PermissionReasonService';

  override getUrlSegment(): string {
    return this.urlService.URLS.PERMISSION_REASONS;
  }
}
