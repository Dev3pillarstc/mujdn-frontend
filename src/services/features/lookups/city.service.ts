import { BaseCrudService } from '@/abstracts/base-crud-service';
import { City } from '@/models/features/lookups/city';
import { Injectable } from '@angular/core';
import { CastResponseContainer, CastResponse } from 'cast-response';
import { Observable } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => City,
  },
  $pagination: {
    model: () => City,
    shape: {'data.list': () => City}
  }

})
export class CityService extends BaseCrudService<City> {
  override serviceName: string = 'CityService';

  override getUrlSegment(): string {
    return this.urlService.URLS.CITIES;
  }


}
