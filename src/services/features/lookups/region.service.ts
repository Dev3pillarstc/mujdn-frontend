import { BaseCrudService } from '@/abstracts/base-crud-service';
import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Region } from '@/models/features/lookups/region/region';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Observable, of, switchMap } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => Region,
  },
  $pagination: {
    model: () => PaginatedList<Region>,
    unwrap: 'data',
    shape: { 'list.*': () => Region },
  },
  $lookup: {
    model: () => BaseLookupModel,
    unwrap: 'data',
    shape: { data: () => BaseLookupModel },
  },
})
@Injectable({
  providedIn: 'root',
})
export class RegionService extends LookupBaseService<Region, number> {
  serviceName: string = 'RegionService';

  override getUrlSegment(): string {
    return this.urlService.URLS.REGIONS;
  }

  @CastResponse(undefined, { fallback: '$lookup' })
  getRegionsLookup(): Observable<BaseLookupModel[]> {
    return this.http
      .get<ListResponseData<BaseLookupModel>>(this.getUrlSegment() + '/' + 'lookup', {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ListResponseData<BaseLookupModel>) => {
          return of(response.data);
        })
      );
  }
}
