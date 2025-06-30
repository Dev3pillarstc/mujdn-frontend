import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { PermissionReason } from '@/models/features/lookups/permission/permission-reason';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
@CastResponseContainer({
  $default: {
    model: () => BaseLookupModel,
  },
  $pagination: {
    model: () => ListResponseData<BaseLookupModel>,
    unwrap: 'data',
    shape: { 'list.*': () => BaseLookupModel },
  },
})
@Injectable({
  providedIn: 'root',
})
export class PermissionTypeService extends LookupBaseService<BaseLookupModel> {
  serviceName: string = 'PermissionTypeService';

  override getUrlSegment(): string {
    return this.urlService.URLS.PERMISSION_TYPES;
  }
}
