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
  isAuthenticated = false;
  private loggedInUser: BehaviorSubject<LoggedInUser | undefined> = new BehaviorSubject<
    LoggedInUser | undefined
  >(undefined);

  get isAdmin() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.ADMIN);
  }

  get isDepartmentManager() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.DEPARTMENT_MANAGER);
  }

  get isHROfficer() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.HR_OFFICER);
  }

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

  setUser(loggedInUser: LoggedInUser | undefined) {
    this.isAuthenticated = !!loggedInUser;
    const user = Object.assign(new LoggedInUser(), loggedInUser);
    this.loggedInUser.next(user);
  }

  getUser(): BehaviorSubject<LoggedInUser | undefined> {
    return this.loggedInUser;
  }

  isFollowUpOfficer() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.FOLLOW_UP_OFFICER);
  }

  isSecurityLeader() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.SECURITY_LEADER);
  }

  isSecurityMember() {
    return this.loggedInUser.value?.roles.includes(ROLES_ENUM.SECURITY_MEMBER);
  }
}
