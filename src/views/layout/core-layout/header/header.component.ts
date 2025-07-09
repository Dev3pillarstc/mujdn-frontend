import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LANGUAGE_BUTTON_LABEL_ENUM } from '@/enums/language-button-label-enum';
import { LocalStorageService } from '@/services/shared/local-storage.service';
import { LanguageService } from '@/services/shared/language.service';
import { AuthService } from '@/services/auth/auth.service';
import { LoggedInUser } from '@/models/auth/logged-in-user';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  languageService = inject(LanguageService);
  translateService = inject(TranslateService);
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  declare currentLanguage: string;
  languageEnum = LANGUAGE_ENUM;
  declare loggedInUser?: LoggedInUser;

  ngOnInit() {
    this.loggedInUser = this.authService.getUser().value;
  }

  getLanguageButtonText() {
    return this.translateService.currentLang === LANGUAGE_ENUM.ARABIC
      ? LANGUAGE_BUTTON_LABEL_ENUM.ENGLISH
      : LANGUAGE_BUTTON_LABEL_ENUM.ARABIC;
  }

  changeLanguage() {
    const targetLanguage =
      this.translateService.currentLang == LANGUAGE_ENUM.ENGLISH
        ? LANGUAGE_ENUM.ARABIC
        : LANGUAGE_ENUM.ENGLISH;
    this.languageService.setLanguage(targetLanguage);
  }

  getLoggedInUserName() {
    return this.translateService.currentLang == LANGUAGE_ENUM.ENGLISH
      ? this.loggedInUser?.fullNameEn
      : this.loggedInUser?.fullNameAr;
  }

  getLoggedInUserDepartment() {
    return this.translateService.currentLang == LANGUAGE_ENUM.ENGLISH
      ? this.loggedInUser?.departNameEn
      : this.loggedInUser?.departNameAr;
  }
}
