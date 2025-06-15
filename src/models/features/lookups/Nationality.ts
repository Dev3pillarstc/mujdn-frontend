import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { NationalityService } from '@/services/features/lookups/nationality.service';
import { InterceptModel } from 'cast-response';
import { NationalityInterceptor } from '@/model-interceptors/features/lookups/nationality-interceptor';

const { send, receive } = new NationalityInterceptor();

@InterceptModel({ send, receive })
export class Nationality extends BaseCrudModel<Nationality, NationalityService> {
  override $$__service_name__$$: string = 'NationalityService';
  declare nameAr: string;
  declare nameEn: string;
  declare isActive: boolean;

  getName() {
    return this.nameEn;
  }
}
