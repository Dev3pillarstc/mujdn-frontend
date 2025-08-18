import { UserProfileDataWithNationalId } from '@/models/features/business/user-profile-data-with-national-id';
import { WorkMission } from '@/models/features/business/work-mission';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { PaginationParams } from '@/models/shared/pagination-params';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { AuthService } from '@/services/auth/auth.service';
import { WorkMissionService } from '@/services/features/business/work-mission.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserProfileService } from '@/services/features/user-profile.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';

export const WorkMissionResolver: ResolveFn<
  {
    missions: PaginatedList<WorkMission> | null;
    departments: BaseLookupModel[] | null;
    myMissions: PaginatedList<WorkMission> | null;
    creators: BaseLookupModel[] | null;
  } | null
> = () => {
  const workMissionService = inject(WorkMissionService);
  const departmentService = inject(DepartmentService);
  const userProfileService = inject(UserProfileService);
  const authService = inject(AuthService);

  const user = authService.getUser().value;

  const canLoadMissionsAndDepartments = !!(authService.isDepartmentManager || authService.isHROfficer);

  return forkJoin({
    missions: canLoadMissionsAndDepartments
      ? workMissionService
        .loadPaginated(new PaginationParams())
        .pipe(catchError(() => of(null)))
      : of(null),

    departments: canLoadMissionsAndDepartments
      ? departmentService.getLookup().pipe(catchError(() => of(null)))
      : of(null),

    myMissions: workMissionService
      .getMyWorkMissionsAsync(new PaginationParams(), {})
      .pipe(
        map(
          (response: PaginatedListResponseData<WorkMission>) =>
            response?.data || null
        ),
        catchError(() => of(null))
      ),

    creators: userProfileService
      .getLookup()
      .pipe(catchError(() => of([]))),
  }).pipe(catchError(() => of(null)));
};
