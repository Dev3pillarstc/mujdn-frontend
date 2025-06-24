import { Department } from '@/models/features/lookups/Department/department';
import { DepartmentResolverData } from '@/models/features/lookups/Department/department-resolver-data';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of, switchMap, map } from 'rxjs';

// Define the return type for the resolver


export const departmentResolver: ResolveFn<any> = (route, state) => {
  const departmentService = inject(DepartmentService);

  return departmentService.getDepartmentTreeAsync().pipe(
    switchMap((departmentsTree) => {
      if (!departmentsTree?.data?.[0]) {
        return of({
          departmentsTree: departmentsTree,
          childDepartments: null
        });
      }

      const firstParentDept = departmentsTree.data[0];

      return departmentService.loadPaginated(
        new PaginationParams(),
        { fkParentDepartmentId: firstParentDept.id }
      ).pipe(
        map((childDepartments: any) => ({
          departmentsTree: departmentsTree,
          childDepartments
        }))
      );
    })
  );
};