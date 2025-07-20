import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { inject, Injectable } from '@angular/core';
import { PrimeNG } from 'primeng/config';

@Injectable({
  providedIn: 'root',
})
export class PrimeNGTranslationServiceService {
  primeNG = inject(PrimeNG);

  constructor() {}
  setPrimeNGTranslation(lang: string) {
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
