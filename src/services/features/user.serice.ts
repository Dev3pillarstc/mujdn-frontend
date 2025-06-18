import { BaseCrudService } from '@/abstracts/base-crud-service';
import { User } from '@/models/auth/user';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseCrudService<User, string> {
  override serviceName: string = 'UserService';
  override getUrlSegment(): string {
    return this.urlService.URLS.USERS;
  }
}
