import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { TranslateService } from '@ngx-translate/core';
import { LOCALSTORAGE_ENUM } from '@/enums/local-storage-enum';
import { LocalStorageService } from '@/services/shared/local-storage.service';
import { FactoryService } from '@/services/factory-service';
import { PrimeNG } from 'primeng/config';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  translateService = inject(TranslateService);
  localStorageService = inject(LocalStorageService);
  primeNG = inject(PrimeNG);

  private _currentLanguage: string = LANGUAGE_ENUM.ENGLISH.toString();
  languageChanged$: BehaviorSubject<string> = new BehaviorSubject(this._currentLanguage);

  constructor() {
    const storedLanguage = this.localStorageService.get(LOCALSTORAGE_ENUM.LANGUAGE);
    if (storedLanguage) {
      this._currentLanguage = storedLanguage;
      this.translateService.use(storedLanguage);
      this.setPrimeNGTranslation(storedLanguage);
    }

    FactoryService.registerService('LanguageService', this);
  }

  getCurrentLanguage(): string {
    return this._currentLanguage;
  }

  setLanguage(lang: string) {
    this._currentLanguage = lang;
    this.translateService.use(lang);
    this.localStorageService.set(LOCALSTORAGE_ENUM.LANGUAGE, lang);
    this.languageChanged$.next(this._currentLanguage);
    this.setPrimeNGTranslation(lang);
  }

  private setPrimeNGTranslation(lang: string) {
    if (lang === LANGUAGE_ENUM.ARABIC) {
      this.primeNG.setTranslation({
        dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
        dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
        monthNames: [
          'يناير',
          'فبراير',
          'مارس',
          'أبريل',
          'مايو',
          'يونيو',
          'يوليو',
          'أغسطس',
          'سبتمبر',
          'أكتوبر',
          'نوفمبر',
          'ديسمبر',
        ],
        monthNamesShort: [
          'ينا',
          'فبر',
          'مار',
          'أبر',
          'ماي',
          'يون',
          'يول',
          'أغس',
          'سبت',
          'أكت',
          'نوف',
          'ديس',
        ],
        today: 'اليوم',
        clear: 'مسح',
        firstDayOfWeek: 6,
        dateFormat: 'dd/mm/yy',
      });
    } else {
      this.primeNG.setTranslation({
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        monthNamesShort: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        today: 'Today',
        clear: 'Clear',
        firstDayOfWeek: 6,
        dateFormat: 'dd/mm/yy',
      });
    }
  }
}
