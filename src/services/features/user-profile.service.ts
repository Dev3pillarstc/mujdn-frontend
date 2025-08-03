import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { UpdateRolesModel } from '@/models/auth/update-roles-model';
import { User } from '@/models/auth/user';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UserProfile } from '@/models/features/user-profile/user-profile';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { ResponseData } from '@/models/shared/response/response-data';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { of, switchMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => User,
  },
  $userProfile: {
    model: () => UserProfile,
    unwrap: 'data',
    shape: { data: () => UserProfile },
  },
})
export class UserProfileService extends BaseCrudService<UserProfile, string> {
  override serviceName: string = 'UserProfileService';

  override getUrlSegment(): string {
    return this.urlService.URLS.USERS;
  }

  @CastResponse(undefined, { fallback: '$userProfile' })
  getMyProfile(): Observable<UserProfile> {
    return this.http
      .get<ResponseData<UserProfile>>(this.getUrlSegment() + '/' + 'myprofile', {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<UserProfile>) => {
          return of(response.data);
        })
      );
  }
}
