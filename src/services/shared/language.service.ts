import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {LANGUAGE_ENUM} from '@/enums/language-enum';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  translateService = inject(TranslateService);
  getCurrentLanguage() {
    return this.translateService.currentLang;
  }

  setLanguage(lang: any) {
    this.translateService.use(lang);
  }
}
