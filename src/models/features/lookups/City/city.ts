import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { CityInterceptor } from '@/model-interceptors/features/lookups/city.interceptor';
import { CityService } from '@/services/features/lookups/city.service';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new CityInterceptor();

@InterceptModel({ send, receive })
export class City extends BaseCrudModel<City, CityService> {
  override $$__service_name__$$: string = 'CityService';
  name?: string;
  isActive?: boolean = false;
  fkCountryId!: number;
  fkRegionId!: number;
  key?: string;
  countryName?: string;
  regionName?: string;
  buildForm() {
    let { name, isActive, fkCountryId, fkRegionId } = this;

    return {
      name: [name, [Validators.required, Validators.maxLength(250)]],
      isActive: [isActive],
      fkCountryId: [fkCountryId, [Validators.required]],
      fkRegionId: [fkRegionId, [Validators.required]],
    };
  }
}
