import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { UpdateRolesModel } from '@/models/auth/update-roles-model';
import { User } from '@/models/auth/user';
import { UserProfilesLookop } from '@/models/auth/users-profiles-lookup';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { ResponseData } from '@/models/shared/response/response-data';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { of, switchMap, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => User,
  },
  $pagination: {
    model: () => PaginatedList<User>,
    unwrap: 'data',
    shape: { 'list.*': () => User },
  },
})
export class UserService extends BaseCrudService<User, string> {
  override serviceName: string = 'UserService';
  override getUrlSegment(): string {
    return this.urlService.URLS.USERS;
  }

  updateUserRoles(data: UpdateRolesModel) {
    return this.http
      .put<ResponseData<UpdateRolesModel>>(`${this.getUrlSegment()}/roles`, data, {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<UpdateRolesModel>) => {
          return of(response.data);
        })
      );


  getUsersProfiles(): Observable<ListResponseData<UserProfilesLookop>> {
    return this.http.get<ListResponseData<UserProfilesLookop>>(
      this.getUrlSegment() + '/' + 'lookup',
      { withCredentials: true }
    );

  }
}
