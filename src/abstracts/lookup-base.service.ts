import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Region } from '@/models/features/lookups/region/region';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Observable, switchMap, of } from 'rxjs';
import { BaseCrudService } from './base-crud-service';
@CastResponseContainer({
  $lookup: {
    model: () => BaseLookupModel,
    unwrap: 'data',
    shape: { data: () => BaseLookupModel },
  },
})
@Injectable({
  providedIn: 'root',
})
export abstract class LookupBaseService<T> extends BaseCrudService<T> {
  @CastResponse(undefined, { fallback: '$lookup' })
  getLookup(): Observable<BaseLookupModel[]> {
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
