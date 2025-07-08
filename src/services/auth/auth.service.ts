import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SingleResponseData } from '@/models/shared/response/single-response-data';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { LoggedInUser } from '@/models/auth/logged-in-user';
import { ROLES_ENUM } from '@/enums/roles-enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseCrudService<LoggedInUser, string> {
  serviceName: string = 'AuthService';
  router = inject(Router);
  private loggedInUser: BehaviorSubject<LoggedInUser | null> =
    new BehaviorSubject<LoggedInUser | null>(null);

  getUrlSegment(): string {
    return this.urlService.URLS.AUTH;
  }

  login(username: string, password: string) {
    return this.http.post<SingleResponseData<LoggedInUser>>(
      this.getUrlSegment() + '/login',
      {
        username: username,
        password: password,
      },
      { withCredentials: true }
    );
  }

  logout() {
    return this.http.get<SingleResponseData<LoggedInUser>>(this.getUrlSegment() + '/logout', {
      withCredentials: true,
    });
  }

  setUser(loggedInUser: LoggedInUser | null) {
    const user = Object.assign(new LoggedInUser(), loggedInUser);
    this.loggedInUser.next(user);
  }

  getUser(): BehaviorSubject<LoggedInUser | null> {
    return this.loggedInUser;
  }

  get isAdmin() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.ADMIN);
  }

  get isDepartmentManager() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.DEPARTMENT_MANAGER);
  }

  get isHROfficer() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.HR_OFFICER);
  }

  get isFollowUpOfficer() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.FOLLOW_UP_OFFICER);
  }

  get isSecurityLeader() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.SECURITY_LEADER);
  }

  get isSecurityMember() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.SECURITY_MEMBER);
  }
}
