import { BaseCrudService } from '@/abstracts/base-crud-service';
import { City } from '@/models/features/lookups/City/city';
import { CityLookup } from '@/models/features/lookups/City/city-lookup';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { ResponseData } from '@/models/shared/response/response-data';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Observable, of, switchMap } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => City,
  },
  $pagination: {
    model: () => PaginatedList<City>,
    unwrap: 'data',
    shape: { 'list.*': () => City },
  },
  $lookup: {
    model: () => CityLookup,
    unwrap: 'data',
    shape: { data: () => CityLookup },
  },
})
@Injectable({
  providedIn: 'root',
})
export class CityService extends BaseCrudService<City> {
  override serviceName: string = 'CityService';

  override getUrlSegment(): string {
    return this.urlService.URLS.CITIES;
  }

  @CastResponse(undefined, { fallback: '$lookup' })
  getCitiesLookup(): Observable<CityLookup[]> {
    return this.http
      .get<ListResponseData<CityLookup>>(this.getUrlSegment() + '/' + 'lookup', {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ListResponseData<CityLookup>) => {
          return of(response.data);
        })
      );
  }
}
