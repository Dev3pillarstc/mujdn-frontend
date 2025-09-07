import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { InterceptModel } from 'cast-response';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';
import { AccessLocationService } from '@/services/features/business/access-location.service';
import { AccessLocationInterceptor } from '@/model-interceptors/features/business/access-location.interceptor';

const { send, receive } = new AccessLocationInterceptor();

@InterceptModel({ send, receive })
export class AccessLocation extends BaseCrudModel<AccessLocation, AccessLocationService> {
  override $$__service_name__$$: string = 'AccessLocationService';
  declare nameAr: string;
  declare nameEn: string;

  buildForm() {
    const { nameAr, nameEn } = this;
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
    };
  }
}
