import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, tap, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {SingleResponseData} from '@/models/shared/response/single-response-data';
import {User} from '@/models/auth/user';
import {BaseCrudService} from '@/abstracts/base-crud-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseCrudService<User, string> {
  serviceName: string = 'AuthService';
  router = inject(Router);
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  getUrlSegment(): string {
    return this.urlService.URLS.AUTH;
  }

  login(email: string, password: string) {
    return this.http
      .post<SingleResponseData<User>>(
        this.getUrlSegment() + '/login',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.data
          );
        })
      );
  }

  autoLogin() {
    const userData: User = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : null;
    if (!userData) {
      return;
    }

    const loadedUser = Object.assign(new User(), {...userData});

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData.tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(user: User) {
    this.user.next(user);
    this.autoLogout(5 * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
