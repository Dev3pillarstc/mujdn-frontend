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

  buildForm() {
    const { nameAr, nameEn } = this;
    return {
      nameAr: [
        nameAr,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.SHORT_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('AR_NUM'),
        ],
      ],
      nameEn: [
        nameEn,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.SHORT_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('ENG_NUM'),
        ],
      ],
    };
  }
}
