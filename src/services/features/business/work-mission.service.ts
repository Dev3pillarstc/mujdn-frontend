import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { OptionsContract } from '@/contracts/options-contract';
import { MissionEmployeesAssignement } from '@/models/features/business/mission-employees-assignment';
import { UserProfileDataWithNationalId } from '@/models/features/business/user-profile-data-with-national-id';
import { WorkMission } from '@/models/features/business/work-mission';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { Department } from '@/models/features/lookups/department/department';
import { PaginationParams } from '@/models/shared/pagination-params';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { toDateOnly } from '@/utils/general-helper';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { map, Observable } from 'rxjs';

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
    model: () => PaginatedList<UserProfileDataWithNationalId>,
    unwrap: 'data',
    shape: { 'list.*': () => UserProfileDataWithNationalId },
  },
})
export class WorkMissionService extends LookupBaseService<WorkMission, number> {
  override serviceName: string = 'WorkMissionService';

  override getUrlSegment(): string {
    return this.urlService.URLS.WORK_MISSION;
  }

  @CastResponse(undefined, { fallback: '$lookup' })
  getEmployeesToBeAssigned(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract
  ): Observable<PaginatedListResponseData<UserProfileDataWithNationalId>> {
    // Build HttpParams safely
    let httpParams = new HttpParams();
    if (paginationParams) {
      Object.entries(paginationParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    // Make the request and rely on @CastResponse for runtime mapping
    return this.http.post(
      this.getUrlSegment() + '/' + 'GetEmployeesToBeAssigned',
      filterOptions || {},
      {
        params: httpParams,
        withCredentials: true,
      }
    ) as unknown as Observable<PaginatedListResponseData<UserProfileDataWithNationalId>>;
  }

  addUsersToMission(model: MissionEmployeesAssignement) {
    return this.http.post(this.getUrlSegment() + '/' + 'AddUsersToMission', model, {
      withCredentials: true,
    });
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  getMyWorkMissionsAsync(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract
  ): Observable<any> {
    let httpParams = new HttpParams();

    // Handle pagination
    if (paginationParams) {
      Object.entries(paginationParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    // Clone filterOptions so we don't mutate the original object
    const processedFilterOptions: OptionsContract = { ...(filterOptions || {}) };

    // Convert dates if present
    if (processedFilterOptions['startDate']) {
      processedFilterOptions['startDate'] = toDateOnly(
        processedFilterOptions['startDate'] as string
      );
    }
    if (processedFilterOptions['endDate']) {
      processedFilterOptions['endDate'] = toDateOnly(processedFilterOptions['endDate'] as string);
    }

    // Call API
    return this.http.post(
      this.getUrlSegment() + '/GetMyWorkMissionsAsync',
      processedFilterOptions,
      {
        params: httpParams,
        withCredentials: true,
      }
    ) as unknown as Observable<any>;
  }
}
