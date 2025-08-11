import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { WorkMission } from '@/models/features/business/work-mission';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Department } from '@/models/features/lookups/department/department';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => WorkMission,
  },
  $pagination: {
    model: () => PaginatedList<Department>,
    unwrap: 'data',
    shape: { 'list.*': () => WorkMission },
  },
  $lookup: {
    model: () => ListResponseData<BaseLookupModel>,
    unwrap: 'data',
    shape: { 'list.*': () => BaseLookupModel },
  },
})
export class WorkMissionService extends LookupBaseService<WorkMission, number> {
  override serviceName: string = 'WorkMissionService';

  override getUrlSegment(): string {
    return this.urlService.URLS.WORK_MISSION;
  }

  @CastResponse(undefined, { fallback: '$lookup' })
  getEmployeesToBeAssigned(): Observable<ListResponseData<BaseLookupModel>> {
    return this.http.get<ListResponseData<BaseLookupModel>>(
      this.getUrlSegment() + '/' + 'GetEmployeesToBeAssigned',
      { withCredentials: true }
    );
  }
}
