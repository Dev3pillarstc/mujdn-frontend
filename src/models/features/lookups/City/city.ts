import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { CityInterceptor } from '@/model-interceptors/features/lookups/city.interceptor';
import { CityService } from '@/services/features/lookups/city.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new CityInterceptor();

@InterceptModel({ send, receive })
export class City extends BaseCrudModel<City, CityService> {
  override $$__service_name__$$: string = 'CityService';
  declare nameAr: string;
  declare nameEn: string;
  declare fkRegionId: number;
  buildForm() {
    const { nameAr, nameEn, fkRegionId } = this;
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
      fkRegionId: [fkRegionId, [Validators.required]],
    };
  }
}
