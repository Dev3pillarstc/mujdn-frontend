import {Component, inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LANGUAGE_ENUM} from '@/enums/language-enum';
import {LANGUAGE_BUTTON_LABEL_ENUM} from '@/enums/language-button-label-enum';
import {LocalStorageService} from '@/services/shared/local-storage.service';
import {LOCALSTORAGE_ENUM} from '@/enums/local-storage-enum';
import {LanguageService} from '@/services/shared/language.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  languageService = inject(LanguageService);
  translateService = inject(TranslateService);
  localStorageService = inject(LocalStorageService);
  declare currentLanguage: string;
  languageEnum = LANGUAGE_ENUM;

  ngOnInit() {

  }

  getLanguageButtonText() {
    let lang: string = LANGUAGE_BUTTON_LABEL_ENUM.ENGLISH;
    if(this.translateService.currentLang === LANGUAGE_ENUM.ARABIC) {
      lang = LANGUAGE_BUTTON_LABEL_ENUM.ENGLISH;
    } else {
      lang = LANGUAGE_BUTTON_LABEL_ENUM.ARABIC;
    }
    return lang;
  }

  changeLanguage() {
    const targetLanguage = this.translateService.currentLang == LANGUAGE_ENUM.ENGLISH ? LANGUAGE_ENUM.ARABIC : LANGUAGE_ENUM.ENGLISH;
    this.languageService.setLanguage(targetLanguage);
  }
}
