import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { UserWorkShiftInterceptor } from '@/model-interceptors/features/lookups/user-work-shift.interceptor';
import UserWorkShift from '@/models/features/lookups/work-shifts/user-work-shifts';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { SingleResponseData } from '@/models/shared/response/single-response-data';
import { Injectable } from '@angular/core';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';
import { Observable } from 'rxjs';

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

  @CastResponse(undefined, { fallback: '$default' })
  @HasInterception
  assignUserShift(
    @InterceptParam() userWorkShift: UserWorkShift
  ): Observable<SingleResponseData<UserWorkShift>> {
    return this.http.post<SingleResponseData<UserWorkShift>>(
      this.getUrlSegment() + '/AssignUserShift',
      userWorkShift,
      { withCredentials: true }
    );
  }
}
