import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { CityInterceptor } from '@/model-interceptors/features/lookups/city.interceptor';
import { CityService } from '@/services/features/lookups/city.service';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new CityInterceptor();

@InterceptModel({ send, receive })
export class City extends BaseCrudModel<City, CityService> {
  override $$__service_name__$$: string = 'CityService';
  declare nameAr: string;
  declare nameEn: string;
  declare isActive: boolean;

  getName() {
    return this.nameEn;
  }
}
