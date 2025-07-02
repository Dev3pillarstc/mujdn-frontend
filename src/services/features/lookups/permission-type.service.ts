import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionTypeService extends LookupBaseService<BaseLookupModel> {
  serviceName: string = 'PermissionTypeService';

  override getUrlSegment(): string {
    return this.urlService.URLS.PERMISSION_TYPES;
  }
}
