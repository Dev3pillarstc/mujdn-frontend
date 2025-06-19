import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { RegionInterceptor } from '@/model-interceptors/features/lookups/region.interceptor';
import { RegionService } from '@/services/features/lookups/region.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new RegionInterceptor();

@InterceptModel({ send, receive })
export class Region extends BaseCrudModel<Region, RegionService> {
  override $$__service_name__$$: string = 'RegionService';
  declare nameAr: string;
  declare nameEn: string;
  isActive: boolean = false;
  buildForm() {
    const { nameAr, nameEn, isActive } = this;
    return {
      nameAr: [
        nameAr,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ARABIC_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('AR_NUM'),
        ],
      ],
      nameEn: [
        nameEn,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ENGLISH_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('ENG_NUM'),
        ],
      ],
      isActive: [isActive, []],
    };
  }
}
