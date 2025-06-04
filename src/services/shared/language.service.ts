import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {LANGUAGE_ENUM} from '@/enums/language-enum';
import {TranslateService} from '@ngx-translate/core';
import {LOCALSTORAGE_ENUM} from "@/enums/local-storage-enum";
import {LocalStorageService} from "@/services/shared/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  translateService = inject(TranslateService);
  localStorageService = inject(LocalStorageService);
  getCurrentLanguage() {
    return this.translateService.currentLang;
  }

  setLanguage(lang: any) {
    if(lang) {
      this.translateService.use(lang);
      this.localStorageService.set(LOCALSTORAGE_ENUM.LANGUAGE, lang);
    } else {
      this.translateService.use(LANGUAGE_ENUM.ENGLISH);
      this.localStorageService.set(LOCALSTORAGE_ENUM.LANGUAGE, LANGUAGE_ENUM.ENGLISH);
    }
  }
}
