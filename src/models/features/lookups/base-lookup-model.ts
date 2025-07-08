import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { FactoryService } from '@/services/factory-service';
import { LanguageService } from '@/services/shared/language.service';

export class BaseLookupModel {
  id?: number;
  nameAr?: string;
  nameEn?: string;
  private languageService?: LanguageService;

  constructor() {
    this.languageService = FactoryService.getService('LanguageService');
  }

  getName(): string {
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? this.nameEn || ''
      : this.nameAr || '';
  }
}
