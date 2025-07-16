import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { UpdateRolesModel } from '@/models/auth/update-roles-model';
import { User } from '@/models/auth/user';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
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
  $pagination: {
    model: () => PaginatedList<User>,
    unwrap: 'data',
    shape: { 'list.*': () => User },
  },
  $userWithDepartment: {
    model: () => UsersWithDepartmentLookup,
    unwrap: 'data',
    shape: { 'list.*': () => UsersWithDepartmentLookup },
  },
})
export class UserService extends LookupBaseService<User, string> {
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
  }

  @CastResponse(undefined, { fallback: '$userWithDepartment' })
  getUsersWithDepartment(): Observable<UsersWithDepartmentLookup[]> {
    return this.http
      .get<ListResponseData<UsersWithDepartmentLookup>>(
        this.getUrlSegment() + '/' + 'lookupWithDepartment',
        {
          withCredentials: true,
        }
      )
      .pipe(
        switchMap((response: ListResponseData<UsersWithDepartmentLookup>) => {
          return of(response.data);
        })
      );
  }
}
