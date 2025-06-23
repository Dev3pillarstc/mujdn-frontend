import { Department } from '@/models/features/lookups/Department/department';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of, switchMap, map } from 'rxjs';

// Define the return type for the resolver
export interface DepartmentResolverData {
  parentDepartment: Department | null;
  childDepartments: PaginatedList<Department>;
}

export const departmentResolver: ResolveFn<DepartmentResolverData> = (route, state) => {
  const departmentService = inject(DepartmentService);

  return departmentService.getDepartmentTreeAsync().pipe(
    switchMap((parentDepartment) => {
      // Check if we have parent department data
      if (!parentDepartment?.data?.[0]) {
        // Return empty structure if no parent department found
        return of({
          parentDepartment: null,
          childDepartments: new PaginatedList<Department>() // or however you create an empty PaginatedList
        });
      }

      // Get the first parent department
      const firstParentDept = parentDepartment.data[0];

      // Load child departments for the parent
      return departmentService.loadPaginated(
        new PaginationParams(),
        { fkParentDepartmentId: firstParentDept.id }
      ).pipe(
        map((childDepartments: PaginatedList<Department>) => ({
          parentDepartment: firstParentDept,
          childDepartments
        }))
      );
    })
  );
};