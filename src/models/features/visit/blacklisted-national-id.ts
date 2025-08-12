import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { BlacklistedNationalIdInterceptor } from '@/model-interceptors/features/visit/blacklisted-national-id.interceptor';
import { CustomValidators } from '@/validators/custom-validators';
import { BlacklistedNationalIdService } from '@/services/features/visit/blacklisted-national-id.service';

const { send, receive } = new BlacklistedNationalIdInterceptor();

@InterceptModel({ send, receive })
export class BlacklistedNationalId extends BaseCrudModel<
  BlacklistedNationalId,
  BlacklistedNationalIdService
> {
  override $$__service_name__$$: string = 'BlacklistedNationalIdService';
  declare nationalId: string;

  constructor() {
    super();
  }

  buildForm() {
    const { nationalId } = this;
    return {
      nationalId: [nationalId, [Validators.required, CustomValidators.pattern('NATIONAL_ID')]],
    };
  }
}
