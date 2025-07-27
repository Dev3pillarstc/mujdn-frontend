import { PaginationParams } from '@/models/shared/pagination-params';
import { CityService } from '@/services/features/lookups/city.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { RegionService } from '@/services/features/lookups/region.service';
import { UserService } from '@/services/features/user.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';

// Define the return type for the resolver

export const departmentResolver: ResolveFn<any> = (route, state) => {
  const departmentService = inject(DepartmentService);
  const cityService = inject(CityService);
  const regionService = inject(RegionService);
  const userService = inject(UserService);

  return departmentService.getDepartmentTreeAsync().pipe(
    switchMap((departmentsTree) => {
      if (!departmentsTree?.data?.[0]) {
        return forkJoin({
          cities: cityService.load(),
          regions: regionService.load(),
        }).pipe(
          map(({ cities, regions }) => ({
            departmentsTree: departmentsTree,
            childDepartments: null,
            cities,
            regions,
          }))
        );
      }

      const firstParentDept = departmentsTree.data[0];

      return forkJoin({
        childDepartments: departmentService.loadPaginated(new PaginationParams(), {
          fkParentDepartmentId: firstParentDept.id,
        }),
        cities: cityService.load(),
        regions: regionService.load(),
        users: userService.getUsersWithDepartment(),
      }).pipe(
        map(({ childDepartments, cities, regions, users }) => ({
          departmentsTree: departmentsTree,
          childDepartments,
          cities,
          regions,
          users,
        }))
      );
    })
  );
};
