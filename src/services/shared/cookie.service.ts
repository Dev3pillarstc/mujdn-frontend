import { Injectable } from '@angular/core';
import { jwtDecode, JwtHeader } from 'jwt-decode';
import { COOKIE_ENUM } from '@/enums/cookie-enum';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  getCookie(name: COOKIE_ENUM): any | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    const token = match ? decodeURIComponent(match[2]) : null;
    const decodedCookie = token ? this.decodeCookie(token) : null;
    console.log('coooooooooo', decodedCookie);
    return decodedCookie;
  }

  private decodeCookie(cookie: string): any {
    if (cookie) {
      const decoded = jwtDecode<JwtHeader>(cookie);
      console.log(decoded);
      return decoded;
    }
    return null;
  }
}
