import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { HolidayInterceptor } from '@/model-interceptors/features/lookups/holiday.interceptor';
import { HolidayService } from '@/services/features/lookups/holiday.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new HolidayInterceptor();

@InterceptModel({ send, receive })
export class Holiday extends BaseCrudModel<Holiday, HolidayService> {
  override $$__service_name__$$: string = 'HolidayService';
  declare nameAr: string;
  declare nameEn: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
  declare notes: String;
  buildForm() {
    const { nameAr, nameEn, startDate, endDate, notes } = this;
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
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, [Validators.required]],
      notes: [notes, [Validators.required]],
    };
  }
}
