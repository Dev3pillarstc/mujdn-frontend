import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { OptionsContract } from '@/contracts/options-contract';
import { UpdateRolesModel } from '@/models/auth/update-roles-model';
import { User } from '@/models/auth/user';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { UserProfilePresenceInquiry } from '@/models/features/presence-inquiry/user-profile-presence-inquiry';
import { ChangeUserPasswordModel } from '@/models/features/user-profile/change-user-password-model';
import { UserProfile } from '@/models/features/user-profile/user-profile';
import { PaginationParams } from '@/models/shared/pagination-params';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { ResponseData } from '@/models/shared/response/response-data';
import { genericDateOnlyConvertor } from '@/utils/general-helper';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';
import { of, switchMap, Observable, catchError, map } from 'rxjs';

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
  $pagination: {
    model: () => PaginatedList<UserProfilePresenceInquiry>,
    unwrap: 'data',
    shape: { 'list.*': () => UserProfilePresenceInquiry },
  },
  $lookup: {
    model: () => ListResponseData<BaseLookupModel>,
    unwrap: 'data',
    shape: { 'data.*': () => BaseLookupModel },
  },
})
export class UserProfileService extends LookupBaseService<UserProfile, string> {
  override serviceName: string = 'UserProfileService';

  override getUrlSegment(): string {
    return this.urlService.URLS.USERS;
  }
  @CastResponse(undefined, { fallback: '$pagination' })
  loadUsersAvailableForPresenceInquiriesPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<UserProfilePresenceInquiry>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<UserProfilePresenceInquiry>>(
        this.getUrlSegment() + '/GetUsersAvailableForInquiryWithPagingAsync',
        filterOptions || {},
        {
          params: httpParams,
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => ({
          list: response.data.list as UserProfilePresenceInquiry[],
          paginationInfo: response.data.paginationInfo,
        }))
      )
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
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

  @CastResponse(undefined, { fallback: '$userProfile' })
  @HasInterception
  updateUserProfile(@InterceptParam() model: UserProfile): Observable<UserProfile> {
    return this.http
      .put<ResponseData<UserProfile>>(this.getUrlSegment() + '/myprofile', model, {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<UserProfile>) => {
          return of(response.data);
        })
      );
  }

  changeUserPassword(model: ChangeUserPasswordModel): Observable<string> {
    return this.http
      .post<ResponseData<string>>(this.getUrlSegment() + '/changePassword', model, {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<string>) => {
          return of(response.data);
        })
      );
  }
}
