import { BaseCrudService } from '@/abstracts/base-crud-service';
import { GeneralSettings } from '@/models/features/setting/general-settings';
import { ResponseData } from '@/models/shared/response/response-data';
import { Injectable } from '@angular/core';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';
import { map, Observable } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => GeneralSettings,
  },
})
@Injectable({
  providedIn: 'root',
})
export class GeneralSettingsService extends BaseCrudService<GeneralSettings> {
  serviceName = 'GeneralSettingsService';

  override getUrlSegment(): string {
    return this.urlService.URLS.GENERAL_SETTINGS;
  }

  @CastResponse(undefined, { fallback: '$default' })
  @HasInterception
  getSettings(): Observable<GeneralSettings> {
    return this.http
      .get<ResponseData<GeneralSettings>>(this.getUrlSegment(), { withCredentials: true })
      .pipe(map((response) => response.data));
  }

  @CastResponse(undefined, { fallback: '$default' })
  @HasInterception
  updateSettings(@InterceptParam() settings: GeneralSettings): Observable<GeneralSettings> {
    return this.http
      .put<ResponseData<GeneralSettings>>(this.getUrlSegment(), settings, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }
}
