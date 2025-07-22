import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { RegionInterceptor } from '@/model-interceptors/features/lookups/region.interceptor';
import { RegionService } from '@/services/features/lookups/region.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { FactoryService } from '@/services/factory-service';
import { LanguageService } from '@/services/shared/language.service';

const { send, receive } = new RegionInterceptor();

@InterceptModel({ send, receive })
export class Region extends BaseCrudModel<Region, RegionService> {
  override $$__service_name__$$: string = 'RegionService';
  declare nameAr: string;
  declare nameEn: string;
  private languageService!: LanguageService;

  constructor() {
    super();
    this.languageService = FactoryService.getService('LanguageService');
  }

  getName(): string {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? this.nameEn
      : this.nameAr;
  }

  buildForm() {
    const { nameAr, nameEn } = this;
    return {
      nameAr: [
        nameAr,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.REGION_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('AR_NUM'),
        ],
      ],
      nameEn: [
        nameEn,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.REGION_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('ENG_NUM'),
        ],
      ],
    };
  }
}
