import { BaseCrudService } from '@/abstracts/base-crud-service';
import { WorkDaysSetting } from '@/models/features/setting/work-days-setting';
import { ResponseData } from '@/models/shared/response/response-data';
import { Injectable } from '@angular/core';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';
import { Observable, of, switchMap } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => WorkDaysSetting,
  },
  $get: {
    model: () => WorkDaysSetting,
    unwrap: 'data',
    shape: { data: () => WorkDaysSetting },
  },
})
@Injectable({
  providedIn: 'root',
})
export class WorkDaysSettingService extends BaseCrudService<WorkDaysSetting> {
  serviceName = 'WorkDaysSettingService';

  override getUrlSegment(): string {
    return this.urlService.URLS.NOTIFICATION_SETTINGS;
  }

  @CastResponse(undefined, { fallback: '$get' })
  @HasInterception
  getWorkDays(): Observable<WorkDaysSetting> {
    return this.http
      .get<ResponseData<WorkDaysSetting>>(this.getUrlSegment() + '/' + 'GetWorkDays', {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<WorkDaysSetting>) => {
          return of(response.data);
        })
      );
  }

  @CastResponse(undefined, { fallback: '$get' })
  @HasInterception
  updateWorkDays(@InterceptParam() data: WorkDaysSetting): Observable<WorkDaysSetting> {
    return this.http
      .put<ResponseData<WorkDaysSetting>>(this.getUrlSegment() + '/' + 'UpdateWorkDays', data, {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<WorkDaysSetting>) => {
          return of(response.data);
        })
      );
  }
}
