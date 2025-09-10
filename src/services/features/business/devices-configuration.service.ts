import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { OptionsContract } from '@/contracts/options-contract';
import { DevicesConfiguration } from '@/models/features/business/devices-configuration';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { genericDateOnlyConvertor } from '@/utils/general-helper';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Observable, map, catchError } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => DevicesConfiguration,
  },
  $pagination: {
    model: () => PaginatedList<DevicesConfiguration>,
    unwrap: 'data',
    shape: { 'list.*': () => DevicesConfiguration },
  },
})
@Injectable({
  providedIn: 'root',
})
export class DevicesConfigurationService extends LookupBaseService<DevicesConfiguration, number> {
  serviceName: string = 'DevicesConfigurationService';

  override getUrlSegment(): string {
    return this.urlService.URLS.DEVICES_CONFIGURATIONS;
  }
}
