import { UserProfileDataWithNationalId } from '@/models/features/business/user-profile-data-with-national-id';
import { WorkMission } from '@/models/features/business/work-mission';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { PaginationParams } from '@/models/shared/pagination-params';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { WorkMissionService } from '@/services/features/business/work-mission.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

export const WorkMissionResolver: ResolveFn<
  {
    missions: PaginatedList<WorkMission> | null;
    assignableEmployees: PaginatedList<UserProfileDataWithNationalId> | null;
    departments: BaseLookupModel[] | null;
  } | null
> = () => {
  const workMissionService = inject(WorkMissionService);
  const departmentService = inject(DepartmentService);

  return forkJoin({
    missions: workMissionService
      .loadPaginated(new PaginationParams())
      .pipe(catchError(() => of(null))),
    assignableEmployees: workMissionService
      .getEmployeesToBeAssigned(new PaginationParams())
      .pipe(catchError(() => of(null))),
    departments: departmentService.getLookup().pipe(catchError(() => of(null))),
  }).pipe(catchError(() => of(null)));
};
