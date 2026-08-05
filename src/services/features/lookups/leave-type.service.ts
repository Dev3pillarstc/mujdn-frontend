import { LeaveType } from '@/models/features/lookups/LeaveType';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { LookupBaseService } from '@/abstracts/lookup-base.service';

@CastResponseContainer({
  $default: {
    model: () => LeaveType,
  },
  $pagination: {
    model: () => PaginatedList<LeaveType>,
    unwrap: 'data',
    shape: { 'list.*': () => LeaveType },
  },
})
@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService extends LookupBaseService<LeaveType, number> {
  serviceName: string = 'LeaveTypeService';

  override getUrlSegment(): string {
    return this.urlService.URLS.LEAVE_TYPES;
  }
}
