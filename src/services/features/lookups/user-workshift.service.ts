import { LookupBaseService } from '@/abstracts/lookup-base.service';
import UserWorkShift from '@/models/features/lookups/work-shifts/user-work-shifts';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => UserWorkShift,
  },
  $pagination: {
    model: () => PaginatedList<UserWorkShift>,
    unwrap: 'data',
    shape: { 'list.*': () => UserWorkShift },
  },
})
export class UserWorkShiftService extends LookupBaseService<UserWorkShift, number> {
  override serviceName: string = 'UserWorkShiftService';
  override getUrlSegment(): string {
    return this.urlService.URLS.User_Work_Shifts;
  }
}
