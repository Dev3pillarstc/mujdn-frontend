import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { BlacklistedNationalityService } from '@/services/features/visit/blacklisted-nationality.service';
import { BlacklistedNationalityInterceptor } from '@/model-interceptors/features/visit/blacklisted-nationality.interceptor';

const { send, receive } = new BlacklistedNationalityInterceptor();

@InterceptModel({ send, receive })
export class BlacklistedNationality extends BaseCrudModel<
  BlacklistedNationality,
  BlacklistedNationalityService
> {
  override $$__service_name__$$: string = 'BlacklistedNationalityService';
  declare nameAr: string;
  declare nameEn: string;
  declare fkNationalityId: number;

  constructor() {
    super();
  }

  buildForm() {
    const { fkNationalityId } = this;
    return {
      fkNationalityId: [fkNationalityId, [Validators.required]],
    };
  }
}
