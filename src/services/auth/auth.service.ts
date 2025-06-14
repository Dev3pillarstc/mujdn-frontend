import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SingleResponseData } from '@/models/shared/response/single-response-data';
import { User } from '@/models/auth/user';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { LoggedInUser } from '@/models/auth/logged-in-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseCrudService<User, string> {
  serviceName: string = 'AuthService';
  router = inject(Router);
  loggedInUser: BehaviorSubject<LoggedInUser | null> = new BehaviorSubject<LoggedInUser | null>(
    null
  );

  getUrlSegment(): string {
    return this.urlService.URLS.AUTH;
  }

  login(username: string, password: string) {
    return this.http.post<SingleResponseData<User>>(
      this.getUrlSegment() + '/login',
      {
        username: username,
        password: password,
      },
      { withCredentials: true }
    );
  }

  // autoLogin() {
  //   const userData: User = localStorage.getItem('userData')
  //     ? JSON.parse(localStorage.getItem('userData')!)
  //     : null;
  //   if (!userData) {
  //     return;
  //   }
  //
  //   const loadedUser = Object.assign(new User(), { ...userData });
  //
  //   if (loadedUser.token) {
  //     this.user.next(loadedUser);
  //     const expirationDuration =
  //       new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
  //     this.autoLogout(expirationDuration);
  //   }
  // }

  logout() {
    // call logout backend
  }
}
