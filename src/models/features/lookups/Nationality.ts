import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { NationalityService } from '@/services/features/lookups/nationality.service';
import { InterceptModel } from 'cast-response';
import { NationalityInterceptor } from '@/model-interceptors/features/lookups/nationality-interceptor';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';

const { send, receive } = new NationalityInterceptor();

@InterceptModel({ send, receive })
export class Nationality extends BaseCrudModel<Nationality, NationalityService> {
  override $$__service_name__$$: string = 'NationalityService';
  declare nameAr: string;
  declare nameEn: string;
  isActive: boolean = true;

  buildForm() {
    const { nameAr, nameEn, isActive } = this;
    const form = {
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

    console.log('form', form);
    return form;
  }
}
