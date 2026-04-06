import { BaseCrudService } from '@/abstracts/base-crud-service';
import { TemporaryRoleAssignment } from '@/models/features/temporary-role-assignment/temporary-role-assignment';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $default: {
    model: () => TemporaryRoleAssignment,
  },
  $pagination: {
    model: () => PaginatedList<TemporaryRoleAssignment>,
    unwrap: 'data',
    shape: { 'list.*': () => TemporaryRoleAssignment },
  },
})
@Injectable({
  providedIn: 'root',
})
export class TemporaryRoleAssignmentService extends BaseCrudService<TemporaryRoleAssignment> {
  override serviceName: string = 'TemporaryRoleAssignmentService';

  override getUrlSegment(): string {
    return this.urlService.URLS.TEMPORARY_ROLE_ASSIGNMENTS;
  }
}
