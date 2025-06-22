import { BaseCrudService } from '@/abstracts/base-crud-service';
import { User } from '@/models/auth/user';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';

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
}
