import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from '@/services/shared/local-storage.service';
import {LANGUAGE_ENUM} from '@/enums/language-enum';
import {LOCALSTORAGE_ENUM} from '@/enums/local-storage-enum';

export function languageInitializer(
  translate: TranslateService,
  localStorage: LocalStorageService,

) {
  return () => {
    const languages = [LANGUAGE_ENUM.ENGLISH, LANGUAGE_ENUM.ARABIC];
    translate.addLangs(languages);
    const currentLang = localStorage.get(LOCALSTORAGE_ENUM.LANGUAGE);
    const defaultLang = LANGUAGE_ENUM.ENGLISH;
    const langToUse = currentLang || defaultLang;
    translate.use(langToUse);
    if (!currentLang) {
      localStorage.set(LOCALSTORAGE_ENUM.LANGUAGE, defaultLang);
    }
  };
}
