import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { User } from '@/models/auth/user';
import { UserProfilesLookop } from '@/models/auth/users-profiles-lookup';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { Observable } from 'rxjs';

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

  getUsersProfiles(): Observable<ListResponseData<UserProfilesLookop>> {
    return this.http.get<ListResponseData<UserProfilesLookop>>(
      this.getUrlSegment() + '/' + 'lookup',
      { withCredentials: true }
    );
  }
}
