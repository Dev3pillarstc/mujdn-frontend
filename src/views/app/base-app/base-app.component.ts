import { Component, inject, OnInit } from '@angular/core';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { COOKIE_ENUM } from '@/enums/cookie-enum';
import { CookieService } from '@/services/shared/cookie.service';
import { AuthService } from '@/services/auth/auth.service';

@Component({
  selector: 'app-base-app',
  imports: [],
  templateUrl: './base-app.component.html',
  styleUrl: './base-app.component.scss',
})
export class BaseAppComponent implements OnInit {
  declare direction: string;
  private languageService = inject(LanguageService);
  private cookieService = inject(CookieService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.setLoggedInUser();
    this.initializeUserLanguage();
    this.listenToLanguageChange();
  }

  initializeUserLanguage() {
    // adding default languages
    this.languageService.translateService.addLangs([LANGUAGE_ENUM.ENGLISH, LANGUAGE_ENUM.ARABIC]);

    // set current language depend on saved language or set en default if no saved language
    const currentSavedLanguage = this.languageService.getCurrentLanguage();
    this.languageService.setLanguage(currentSavedLanguage);
  }

  listenToLanguageChange() {
    // change the direction of layout depend on language change
    this.languageService.languageChanged$.subscribe((newLanguage) => {
      this.direction =
        newLanguage === LANGUAGE_ENUM.ARABIC
          ? LAYOUT_DIRECTION_ENUM.RTL
          : LAYOUT_DIRECTION_ENUM.LTR;
    });
  }

  setLoggedInUser() {
    const userDataCookie = this.cookieService.getCookie(COOKIE_ENUM.USER_DATA);
    userDataCookie && this.authService.setUser(userDataCookie);
  }
}
