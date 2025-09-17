import { BaseCrudService } from '@/abstracts/base-crud-service';
import { ManualProcessing } from '@/models/features/business/manual-processing';
import { Notification } from '@/models/features/setting/notification';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { ResponseData } from '@/models/shared/response/response-data';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { Observable, of, switchMap } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => ManualProcessing,
  },
  $pagination: {
    model: () => PaginatedList<ManualProcessing>,
    unwrap: 'data',
    shape: { 'list.*': () => ManualProcessing },
  },
})
@Injectable({
  providedIn: 'root',
})
export class ManualProcessingService extends BaseCrudService<ManualProcessing> {
  override serviceName: string = 'ManualProcessingService';

  override getUrlSegment(): string {
    return this.urlService.URLS.MANUAL_PROCESSING;
  }

  excuteManualProcessing(model: ManualProcessing): Observable<string> {
    return this.http
      .post<ResponseData<string>>(this.getUrlSegment() + '/excute', model, {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<string>) => {
          return of(response.data);
        })
      );
  }
}
